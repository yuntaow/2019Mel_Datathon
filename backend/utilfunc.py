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

from GeoLibrary import *
# from GenerateGeoJSON import GetLatLongForCoords

GRID_WIDTH = 512
GRID_HEIGHT = 512

with open("FullSugar.geojson") as f:
	features = json.load(f)["features"]

# helper functions
def swapLatLon(coord):
	return (coord[1],coord[0])

def GetFourPositions(x,y):
	top_left_pos=(GRID_WIDTH*x,GRID_HEIGHT*y)
	top_right_pos=(GRID_WIDTH*(x+1),GRID_HEIGHT*y)
	bottom_left_pos=(GRID_WIDTH*x,GRID_HEIGHT*(y+1))
	bottom_right_pos=(GRID_WIDTH*(x+1),GRID_HEIGHT*(y+1))
	return [top_left_pos,top_right_pos,bottom_right_pos, bottom_left_pos]

def GetLatLongForCoords(x,y,top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long, fullImageWidth, fullImageHeight):
	angle=0
	if x!=0:
		angle=atan(y/x)
	else :
		angle=1.570796 # 90 degrees in radians
	bearing=GetBearing(swapLatLon(top_left_lat_long),swapLatLon(top_right_lat_long))
	total_bearing=(bearing+degrees(angle) + 360) % 360
	distance_hor=GetDistanceMeters(swapLatLon(top_left_lat_long),swapLatLon(top_right_lat_long))
	distance_ver=GetDistanceMeters(swapLatLon(top_left_lat_long),swapLatLon(bottom_left_lat_long))
	distance_x=distance_hor/fullImageWidth*x
	distance_y=distance_ver/fullImageHeight*y
	distance_from_top_left=sqrt(distance_x**2+distance_y**2)
	retLatLon=GetLatLongFromPointBearingDistance(swapLatLon(top_left_lat_long),total_bearing,distance_from_top_left)
	return swapLatLon(retLatLon)



# alan code
def get_timeseries(filepath):
	list_dir = listdir(filepath)
	date_list = []
	for f in list_dir:
		y = f[:4]
		m = f[4:6]
		d = f[6:8]
		date_list.append("{}-{}-{}".format(y,m,d))

	date_list.sort(key = lambda date: datetime.strptime(date, '%Y-%m-%d'))
	return date_list


# get the geo coordinates for a certain tile 
# return lat lon for diagnal corners
def get_coordinates(filepath):
	dataset = rasterio.open(filepath)
	topleft = dataset.transform * (0, 0)
	bottomright = dataset.transform * (dataset.width, dataset.height)

	dataset_crs = dataset.crs
	dataset_crs_str = dataset_crs.to_string()

	inProj = Proj(init=dataset_crs_str)
	outProj = Proj(init='epsg:4326')   # epsh:4326 means latlon
	topleft_x, topleft_y = topleft[0], topleft[1]
	bottomright_x, bottomright_y = bottomright[0], bottomright[1]

	topleft_x_transformed, topleft_y_transformed = transform(inProj,outProj,topleft_x,topleft_y) 
	# e.g. 147.95529899839866   -19.893321306080015
	bottomright_x_transformed, bottomright_y_transformed = transform(inProj,outProj,bottomright_x,bottomright_y)

	return [[topleft_x_transformed, topleft_y_transformed], [bottomright_x_transformed, bottomright_y_transformed]]   


def get_size(filepath):
	dataset = rasterio.open(filepath)
	return [dataset.width, dataset.height]


# conversion from larlon to xy
def latlon_to_xy(lat1,lon1,lat2,lon2):
	dx = abs(lon1-lon2)*40000*math.cos((lat1+lat2)*math.pi/360)/360
	dy = abs(lat1-lat2)*40000/360
	print(dx*1000/10, " ",dy*1000/10)   # answer in km
	return [math.floor(dx*1000/10), math.floor(dy*1000/10)]


"""
def get_sugarcane_positions(filepath):

	# need to find mask 
	# what is the coordinates? 
	# these are latlon
	[[topleft_x, topleft_y], [bottomright_x, bottomright_y]] = get_coordinates(filepath)


	# these are xy coordinates
	lat_origin,lon_origin = topleft_y,topleft_x
	[top_x,top_y] = [0,0]
	[bottom_x,bottom_y] = get_size(filepath)

	print(top_x, " ", top_y, " ", bottom_x, " ", bottom_y)

	# Coordinates may be wrong!!! 


	result=geometry.GeometryCollection()


	top_left_lat_long, top_right_lat_long = tuple([topleft_x, topleft_y]), tuple([topleft_x, bottomright_y])
	bottom_right_lat_long, bottom_left_lat_long = tuple([bottomright_x, bottomright_y]), tuple([bottomright_x, topleft_y])
	fullImageWidth, fullImageHeight = get_size(filepath)

	
	# coordinates wrong, need to swap topright and bottomleft
	return [result, top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long, fullImageWidth, fullImageHeight]
"""




if __name__ == '__main__':
	filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"
	# dataset = rasterio.open(filepath+"20161222.tif")

	# for f in get_timeseries(filepath):
	# 	print(f)
	date_list = get_timeseries(filepath)
	# print(date_list)

	# [result, top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long, fullImageWidth, fullImageHeight] \
	# = get_sugarcane_positions(filepath+"20161222.tif")
	# print(len(needed_ij_list))

	# print("TL: {}, \n TR: {} \n BR: {} \n BL: {}".format(top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long))


	print("finish")






	