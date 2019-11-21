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

from GeoLibrary import *
from utilfunc import *


with open("T55KFT_sugarcane_positions.json", "r") as fp:
	tile_sugarcane_position_dict = json.load(fp)


# Get NDVI for 1 particular date and 1 particular tile
def get_ndvi(filepath, sugarcane_pos):
	dataset = rasterio.open(filepath)
	band3 = dataset.read(3)   # red 
	band4 = dataset.read(4)   # NIR

	ndvi_list = []
	zero_ndvi_cnt = 0
	invalid_cnt = 0
	for sugarcane in tqdm(sugarcane_pos):
		x,y = sugarcane[0], sugarcane[1]
		red = band3[ x,y ]
		nir = band4[ x,y ]

		ndvi = None
		if isinstance(red, (np.float32, np.float64, np.integer)) and isinstance(nir, (np.float32, np.float64, np.integer)):
			if ( nir + red ) == 0:
				zero_ndvi_cnt+=1
			else:
				ndvi = (nir - red) / (nir + red)
				# ndvi_list.append(ndvi)
		else:
			invalid_cnt += 1

		if ndvi == None:
			ndvi_list.append(ndvi)
		else:
			ndvi_list.append(float(ndvi))
	# print("There are {} invalid and {} zero ndvi".format(invalid_cnt, zero_ndvi_cnt))

	# mean_ndvi = np.mean(np.array(ndvi_list))
	return ndvi_list


def get_ndvi_from_bandinfo(image_name):
	with open("./band_info/band-{}.txt".format(image_name[:8]), 'rb') as fp:
		b = pickle.load(fp)

	df = pd.DataFrame(b, columns=["blue", "green", "red", "nir", "swir"])
	ndvi_list = np.divide( np.subtract(df["nir"], df["red"]), np.add(df["nir"], df["red"]) )
	# mean_ndvi = np.mean(ndvi_list)
	return ndvi_list.tolist()



def get_all_ndvi(filepath):
	sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]
	# image_names = listdir(filepath)  # unsorted

	date_list = get_timeseries(filepath)
	print(date_list[:27])
	date_list = date_list[:27]


	
	image_names = []
	for d in date_list:
		date_info = d.split('-')
		image_names.append("{}{}{}.tif".format(date_info[0], date_info[1], date_info[2]))

	mean_ndvi_list = []
	total_ndvi_dict = {}
	for image_name in image_names:
		print( "######### This iteration is for date {} ########".format(image_name) )
		image_filepath = filepath + image_name
		# ndvi_list = get_ndvi(image_filepath, sugarcane_pos)
		ndvi_list = get_ndvi_from_bandinfo(image_name)
		# print(ndvi)
		# mean_ndvi_list.append(float(ndvi))
		# total_ndvi_dict[image_name] = ndvi_list

		datestr = image_name[:8]
		tmp_dict = { datestr: ndvi_list }

		with open("./ndvi_info/ndvi_list_"+datestr+".json", "w") as fp:
			json.dump(tmp_dict, fp)
		
		
	
	# return mean_ndvi_list
	return total_ndvi_dict



# this method is too slow 
# no use
"""
def get_custom_ndvi(filepath, daterange, sugarpositions):
	startDate = datetime.strptime( daterange[0], "%Y-%m-%d")
	endDate = datetime.strptime( daterange[1], "%Y-%m-%d")

	date_list = get_timeseries(filepath)
	sugar_daterange = []
	for d in date_list:
		do = datetime.strptime(d, "%Y-%m-%d")
		if do >= startDate and do <= endDate:
			sugar_daterange.append(d)

	image_names = []
	for d in sugar_daterange:
		date_info = d.split('-')
		image_names.append("{}{}{}.tif".format(date_info[0], date_info[1], date_info[2]))


	mean_ndvi_list = []
	for image_name in image_names:
		print( "######### This iteration is for date {} ########".format(image_name) )
		image_filepath = filepath + image_name
		ndvi = get_ndvi(image_filepath, sugarpositions)
		# print(ndvi)
		mean_ndvi_list.append(float(ndvi))

	return { "mean_ndvi_list": mean_ndvi_list, "date_list": sugar_daterange }
"""

# def get_sub_ndvi(ndvi_dict, )

def get_daterange(filepath, daterange):
	startDate = datetime.strptime( daterange[0], "%Y-%m-%d")
	endDate = datetime.strptime( daterange[1], "%Y-%m-%d")

	date_list = get_timeseries(filepath)
	sugar_daterange = []
	for d in date_list:
		do = datetime.strptime(d, "%Y-%m-%d")
		if do >= startDate and do <= endDate:
			sugar_daterange.append(d)

	return sugar_daterange


def get_mean_ndvi_16(filepath):
	date_list = get_timeseries(filepath)
	print(date_list[:27])
	date_list = date_list[:27]

	image_names = []
	for d in date_list:
		date_info = d.split('-')
		image_names.append("{}{}{}.tif".format(date_info[0], date_info[1], date_info[2]))


	mean_ndvi_list_16 = []
	for image_name in image_names:
		print( "######### This iteration is for date {} ########".format(image_name) )
		
		with open("./ndvi_info/ndvi_list_"+image_name[:8]+".json", "r") as fp:
			ndvi_dict = json.load(fp)
		ndvi_list = ndvi_dict[image_name[:8]]

		print(len(ndvi_list))
		print(ndvi_list.count(None))
		ndvi_list = list(filter(None, ndvi_list)) 
		mean_ndvi = np.nanmean( np.array(ndvi_list) )
		# mean_ndvi = np.mean( np.array(ndvi_list) )
		print(mean_ndvi)
		mean_ndvi_list_16.append(mean_ndvi)

	with open("T55KFT_mean_ndvi.json", "r") as fp:
		mean_ndvi_dict = json.load(fp)
	mean_ndvi_list = mean_ndvi_dict["mean_ndvi_list"]
	date_after16 = mean_ndvi_dict["date_list"]

	total_date_list = date_list + date_after16
	total_mean_ndvi_list = mean_ndvi_list_16 + mean_ndvi_list

	total_ndvi_dict = {"date_list":total_date_list, "mean_ndvi": total_mean_ndvi_list}


	with open("T55KFT_mean_ndvi_total.json", "w") as fp:
		json.dump(total_ndvi_dict, fp)

	print("finish")


def get_mean_ndvi_recent(filepath):
	date_list = get_timeseries(filepath)
	print(date_list[-13:])
	
	date_list = date_list[-13:]

	image_names = []
	for d in date_list:
		date_info = d.split('-')
		image_names.append("{}{}{}.tif".format(date_info[0], date_info[1], date_info[2]))


	mean_ndvi_list_recent = []
	for image_name in image_names:
		print( "######### This iteration is for date {} ########".format(image_name) )
		
		with open("./ndvi_info/ndvi_list_"+image_name[:8]+".json", "r") as fp:
			ndvi_dict = json.load(fp)
		ndvi_list = ndvi_dict[image_name[:8]]

		print(len(ndvi_list))
		print(ndvi_list.count(None))
		ndvi_list = list(filter(None, ndvi_list)) 
		mean_ndvi = np.nanmean( np.array(ndvi_list) )
		mean_ndvi_list_recent.append(mean_ndvi)

	with open("T55KFT_mean_ndvi_total.json", "r") as fp:
		mean_ndvi_dict = json.load(fp)

	mean_ndvi_list = mean_ndvi_dict["mean_ndvi"]
	date_after16 = mean_ndvi_dict["date_list"]

	total_date_list = date_after16 + date_list
	total_mean_ndvi_list = mean_ndvi_list + mean_ndvi_list_recent

	total_ndvi_dict = {"date_list":total_date_list, "mean_ndvi": total_mean_ndvi_list}

	with open("T55KFT_mean_ndvi_total_2.json", "w") as fp:
		json.dump(total_ndvi_dict, fp)

	print("finish")
	



if __name__ == '__main__':
	filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"

	# for 2016 
	# filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img_1/T55KFT/split_dates/"
	# dataset = rasterio.open(filepath+"20161222.tif")

	# date_list = get_timeseries(filepath)
	# sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]
	# print(len(sugarcane_pos))


	# get_all_ndvi(filepath)
	
	# total_ndvi_dict = get_all_ndvi(filepath)

	get_mean_ndvi_recent(filepath)

	# ndvi_dict = {"date_list": date_list, "mean_ndvi_list": mean_ndvi_list}
	# with open("T55KFT_total_ndvi_list_16.json", "w") as fp:
	# 	json.dump(total_ndvi_dict, fp)
	


