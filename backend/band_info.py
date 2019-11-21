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



def get_band_info(filepath, sugarcane_pos):
	dataset = rasterio.open(filepath)
	band1 = dataset.read(1)  # blue
	band2 = dataset.read(2)  # green 
	band3 = dataset.read(3)   # red 
	band4 = dataset.read(4)   # NIR
	band5 = dataset.read(5)   # swir

	band_info_list = []
	for sugarcane in tqdm(sugarcane_pos):
		x,y = sugarcane[0], sugarcane[1]
		blue = band1[ x,y ]
		green = band2[ x,y ]
		red = band3[ x,y ]
		nir = band4[ x,y ]
		swir = band5[ x,y ]

		band_info = [ blue, green, red, nir, swir ]
		band_info_list.append(band_info)

	return band_info_list


def get_all_band_info(filepath):
	sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]

	date_list = get_timeseries(filepath)
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
		band_info_list = get_band_info(image_filepath, sugarcane_pos)

		with open("./band_info/band-{}.txt".format(image_name[:8]), "wb") as fp:
			pickle.dump(band_info_list, fp)

		
		
	print("finish")






if __name__ == '__main__':
	# filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"
	# for 2016
	filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img_1/T55KFT/split_dates/"

	get_all_band_info(filepath)

	# test 
	"""
	with open("./band_info/band-20161222.txt", "rb") as fp:   # Unpickling
		b = pickle.load(fp)
	print(len(b))
	print(len(b[0]))
	"""










	