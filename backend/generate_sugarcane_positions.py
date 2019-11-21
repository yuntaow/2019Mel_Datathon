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

from GeoLibrary import *
from utilfunc import *

GRID_WIDTH = 512
GRID_HEIGHT = 512

with open("FullSugar.geojson") as f:
	features = json.load(f)["features"]

# generate latlon coordinates for each grid in the tile
def generate_positions(filepath):
	width,height = get_size(filepath)

	# absolute latlon for the tile
	latlon_tile = [(147.95529899839866, -19.893321306080015), \
			   (149.01671779369045, -19.893321306080015), \
			   (149.01671779369045, -20.876176661128618), \
				(147.95529899839866, -20.876176661128618)]

	top_left_lat_long, top_right_lat_long, bottom_right_lat_long, bottom_left_lat_long = latlon_tile[0], latlon_tile[1],\
																		latlon_tile[2], latlon_tile[3]

	fullImageWidth, fullImageHeight = width,height


	numOfXSquares=fullImageWidth//GRID_WIDTH
	numOfYSquares=fullImageHeight//GRID_HEIGHT
	grid_latlon_dict = {}
	for x in list(range(numOfXSquares)):
		for y in list(range(numOfYSquares)):
			fourLatLongPositions = [GetLatLongForCoords(r[0],r[1], top_left_lat_long, top_right_lat_long,\
												bottom_right_lat_long, bottom_left_lat_long, \
												fullImageWidth, fullImageHeight) for r in GetFourPositions(x,y)]
			grid_latlon_dict["{}-{}".format(x,y)] = fourLatLongPositions

	return grid_latlon_dict


# get sugarcane xy positions in a given tile
# only need to run once for each tile
# store it in disk
def generate_sugarcane_position(filepath):
	grid_latlon_dict = generate_positions(filepath)

	# absolute coordinate for the tile

	latlon_tile = [(147.95529899839866, -19.893321306080015), \
			   (149.01671779369045, -19.893321306080015), \
			   (149.01671779369045, -20.876176661128618), \
				(147.95529899839866, -20.876176661128618)]

	top_left_lat_long, top_right_lat_long, bottom_right_lat_long, bottom_left_lat_long = latlon_tile[0], latlon_tile[1],\
																		latlon_tile[2], latlon_tile[3]


	fullImageWidth = 10980
	fullImageHeight = 10980

	cnt = 0
	total_sugarcane_positions = []
	for key, value in grid_latlon_dict.items():
		# top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long = list(value[0]), list(value[1]), list(value[2]), list(value[3])
		# fullImageWidth = GRID_WIDTH
		# fullImageHeight = GRID_HEIGHT

		gridGeo = { "type": "Polygon", "coordinates": [[ list(value[0]), \
													 list(value[1]), \
													 list(value[2]), \
													 list(value[3]), \
													 list(value[0]) ]]  }
		
		gridGeo_go = geometry.GeometryCollection([geometry.shape(gridGeo).buffer(0)])

		result=geometry.GeometryCollection()
		for k in features:
			if geometry.shape(k["geometry"]).intersects(gridGeo_go):
				result=result.union(geometry.shape(k["geometry"]).intersection(gridGeo_go))

		if gridGeo_go.intersects(result):
			cnt+=1
			# print(True)
			print("############## This iteration is for the {}th grid, key {} ##############".format(cnt, key))
			print(value)
			needed_ij_list = []
			# find the mask in the input region
			print(top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long )


			xy_pair = key.split('-') # relative position
			grid_x, grid_y = int(xy_pair[0]), int(xy_pair[1])
			print( GetFourPositions(grid_x,grid_y) )

			grid_x_abs, grid_y_abs = grid_x * GRID_WIDTH, grid_y * GRID_HEIGHT

			print(grid_x_abs, grid_y_abs)
			

			for i in tqdm(list(range( grid_x_abs, grid_x_abs + GRID_WIDTH ))):
				for j in list(range( grid_y_abs, grid_y_abs + GRID_HEIGHT )):

					lat_long=GetLatLongForCoords(i,j, top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long, fullImageWidth, fullImageHeight)
					if result.intersects(geometry.Point(lat_long)):
						# this coordinate is needed

						needed_ij_list.append((i,j))
						# print(True)

			

			total_sugarcane_positions += needed_ij_list
			# print(needed_ij_list)

			# data = np.zeros( (512,512,3), dtype=np.uint8 )

			# for pair in needed_ij_list:
			# 	i = pair[0]
			# 	j = pair[1]
			# 	newi = i - grid_x * GRID_WIDTH
			# 	newj = j - grid_y * GRID_HEIGHT

			# 	data[newj,newi] = (255,255,255)
			# imageio.imwrite("test.png", data)

		# else:
			# print(False)

		# if cnt == 1:
		# 	break

	print(cnt)
	return total_sugarcane_positions


if __name__ == '__main__':
	filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"
	tile_filepath = filepath+"20161222.tif"

	# grid_latlon_dict = generate_positions(tile_filepath)
	# print(grid_latlon_dict)

	total_sugarcane_positions = generate_sugarcane_position(tile_filepath)
	tile1_dict = { "sugarcane_positions": total_sugarcane_positions }
	with open("tile1_sugarcane_positions.json", "w") as fp:
		json.dump(tile1_dict, fp)










