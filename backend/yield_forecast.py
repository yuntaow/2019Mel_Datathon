import pandas as pd
import numpy as np
from tqdm.auto import tqdm
import rasterio
from pyproj import Proj, transform
from os import listdir
from datetime import datetime
import json
import math
from math import atan,degrees,sqrt
from shapely import geometry
from multiprocessing import Pool

from PIL import Image, ImageDraw
import scipy.misc as smp
import imageio

import statistics
import pickle

from sklearn.linear_model import LinearRegression
import time

from GeoLibrary import *
from utilfunc import *


# slide window class 
# reference: https://towardsdatascience.com/ml-approaches-for-time-series-4d44722e48fe

class WindowSlider(object):
	
	def __init__(self, window_size = 5):		
		'''
		Window Slider object
		====================
		w: window_size - number of time steps to look back
		o: offset between last reading and temperature
		r: response_size - number of time steps to predict
		l: maximum length to slide - (#observation - w)
		p: final predictors - (#predictors * w)
		'''
		self.w = window_size
		self.o = 0
		self.r = 1	   
		self.l = 0
		self.p = 0
		self.names = []
		
	def re_init(self, arr):
		'''
		Helper function to initializate to 0 a vector
		'''
		arr = np.cumsum(arr)
		return arr - arr[0]
				

	def collect_windows(self, X, window_size=5, offset=0, previous_y=False):
		'''
		Input: X is the input matrix, each column is a variable
		Returns: diferent mappings window-output
		'''
		cols = len(list(X)) - 1
		N = len(X)
		
		self.o = offset
		self.w = window_size
		# alan code
		self.l = N - (self.w + self.r) + 1 + 1
		if not previous_y: self.p = cols * (self.w)
		if previous_y: self.p = (cols + 1) * (self.w)
		
		# Create the names of the variables in the window
		# Check first if we need to create that for the response itself
		if previous_y: x = cp.deepcopy(X)
		if not previous_y: x = X.drop(X.columns[-1], axis=1)  
		
		for j, col in enumerate(list(x)):		
				
			for i in range(self.w):
				
				name = col + ('(%d)' % (i+1))
				self.names.append(name)
		
		# Incorporate the timestamps where we want to predict
		for k in range(self.r):
			
			name = '∆t' + ('(%d)' % (self.w + k + 1))
			self.names.append(name)
			
		self.names.append('Y')
				
		df = pd.DataFrame(np.zeros(shape=(self.l, (self.p + self.r + 1))), 
						  columns=self.names)
		
		# Populate by rows in the new dataframe
		for i in range(self.l):
			
			slices = np.array([])
			
			# Flatten the lags of predictors
			for p in range(x.shape[1]):
			
				line = X.values[i:self.w + i, p]
				# Reinitialization at every window for ∆T
				if p == 0: line = self.re_init(line)
					
				# Concatenate the lines in one slice	
				slices = np.concatenate((slices, line)) 
 
			# Incorporate the timestamps where we want to predict
			line = np.array([self.re_init(X.values[i:i+self.w+self.r, 0])[-1]])
			# alan code
			if i == N-self.w:
				y = np.array(0).reshape(1,)
			else:
				y = np.array(X.values[self.w + i + self.r - 1, -1]).reshape(1,)
			slices = np.concatenate((slices, line, y))
			
			# Incorporate the slice to the cake (df)
			df.iloc[i,:] = slices
			
		return df





def feature_engineer(image_name):
	with open("./band_info/band-{}.txt".format(image_name[:8]), 'rb') as fp:
		b = pickle.load(fp)

	df = pd.DataFrame(b, columns=["blue", "green", "red", "nir", "swir"])
	mean_value_list = df.mean(axis = 0).values.tolist()

	return mean_value_list



def all_feature_engineer(filepath):

	date_list = get_timeseries(filepath)
	date_list = date_list[:27]

	image_names = []
	for d in date_list:
		date_info = d.split('-')
		image_names.append("{}{}{}.tif".format(date_info[0], date_info[1], date_info[2]))


	total_value_list = []
	for image_name in image_names:
		print( "######### This iteration is for date {} ########".format(image_name) )
		mean_value_list = feature_engineer(image_name)
		total_value_list.append(mean_value_list)


	mean_df = pd.DataFrame(total_value_list, columns=["blue", "green", "red", "nir", "swir"])
	mean_df.to_csv("mean_band_value_16.csv", index=False)




def feature_for_timeseries(filepath):
	date_list = get_timeseries(filepath)
	date_list = date_list[27:]

	timestamp_list = []
	for t in date_list:
		day = datetime.strptime(t, "%Y-%m-%d")
		timestamp = datetime.timestamp(day)
		timestamp_list.append(timestamp)

	deltaT_list = []
	for i in list(range(len(timestamp_list))):
		if i == len(timestamp_list) - 1:
			break
		deltaT = timestamp_list[i+1] - timestamp_list[i]
		deltaT_list.append(deltaT)

	deltaT_list.insert(0, 0)

	mean_df = pd.read_csv("mean_band_value.csv")
	mean_df_16 = pd.read_csv("mean_band_value_16.csv")

	# total_mean_df = pd.concat([mean_df_16, mean_df], axis=0)


	with open("T55KFT_mean_ndvi_total_2.json", "r") as fp:
		mean_ndvi = json.load(fp)
	mean_ndvi_list = mean_ndvi["mean_ndvi"]

	print(len(timestamp_list))
	print(len(mean_ndvi_list))
	# print(total_mean_df.info())


	train_df_formulated = pd.DataFrame( {"timestamp":timestamp_list, "deltaT":deltaT_list, \
			   "mean_red_list": mean_df["red"].values, "mean_green_list":mean_df["green"].values,"mean_blue_list":mean_df["blue"].values, \
			   "mean_nir": mean_df["nir"], "mean_swir": mean_df["swir"], \
			   "mean_ndvi":mean_ndvi_list[27:]})

	print(train_df_formulated.head())
	print(train_df_formulated.info())

	train_df_formulated.to_csv("timeseries_traindf.csv", index=False)
	print("finish")


def train_timeseries_and_predict(datestr, drought):
	total_train_df = pd.read_csv("./timeseries_traindf_with_drought.csv")
	ndvi_label = total_train_df["mean_ndvi"]
	total_train_df.drop(["mean_ndvi", "temp", "rainfall"], axis=1, inplace=True)
	total_train_df["mean_ndvi"] = ndvi_label

	w = 5
	train_constructor = WindowSlider()
	train_windows = train_constructor.collect_windows(total_train_df.iloc[:,1:], 
												  previous_y=False)


	lr_model = LinearRegression()
	lr_model.fit(train_windows.iloc[:-1, :-1], train_windows.iloc[:-1, -1])

	t0 = time.time()
	lr_y_fit = lr_model.predict(train_windows.iloc[:,:-1])
	tF = time.time()


	lr_residuals = lr_y_fit - train_windows['Y'].values
	lr_rmse = np.sqrt(np.sum(np.power(lr_residuals,2)) / len(lr_residuals))

	print('RMSE = %.2f' % lr_rmse)
	print('Time to train = %.2f seconds' % (tF - t0))


	test_y = train_windows.iloc[-1,:-1].values
	day = datetime.strptime(datestr, "%Y-%m-%d")
	timestamp = datetime.timestamp(day)

	basetime = total_train_df["timestamp"].values.tolist()[-1]
	testdelta = timestamp - basetime

	test_df = pd.DataFrame( [test_y], columns=train_windows.columns[:-1] )
	test_df["∆t(6)"] = testdelta
	test_df["drought(5)"] = drought

	lr_y_test = lr_model.predict(test_df.iloc[:,:])

	print(lr_y_test)

	return lr_y_test[0]


# need to get the forecast yield 




if __name__ == '__main__':
	filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"
	# for 2016
	# filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img_1/T55KFT/split_dates/"


	# all_feature_engineer(filepath)
	# feature_for_timeseries(filepath)

	datestr = "2019-11-05"
	train_timeseries_and_predict(datestr, 0)





