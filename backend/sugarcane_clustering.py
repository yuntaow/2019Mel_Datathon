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
import operator

from collections import Counter

from sklearn.cluster import KMeans

from GeoLibrary import *
from utilfunc import *

with open("T55KFT_sugarcane_positions.json", "r") as fp:
	tile_sugarcane_position_dict = json.load(fp)


"""
Q208 − 33.3%
Q183 − 17.1%
Q232 − 15.2%
Q240 − 11.5%
KQ228 − 6.4%
Q242 − 5.3%
Q238 − 3.1%
Q212 − 1.6%
Q138 − 1.6%
Q200 − 1.6%
Q226 − 1.3%
Q190 − 0.8% 
Q249 − 0.7%
"""
sorted_type = ["Q208", "Q183","Q232","Q240","KQ228","Q242","Q238","Q212","Q138","Q200","Q226","Q190","Q249"]




def clustering(datestr, numType):
	with open("./band_info/band-{}.txt".format(datestr), 'rb') as fp:
		b = pickle.load(fp)

	df = pd.DataFrame(b, columns=["blue", "green", "red", "nir", "swir"])

	kmeans = KMeans(n_clusters=numType, random_state=0, verbose=True, n_jobs=-1, tol=1e-5, max_iter=900)
	X = df.values
	kmeans.fit(X)

	type_y = kmeans.labels_

	print( type(type_y) )

	# c = Counter(type_y.tolist())
	# dict(c)

	return type_y.tolist()


def map_type():
	with open("type_dict.json", "r") as fp:
		type_dict = json.load(fp)

	datelist = ["20180809", "20190804"]
	map_res_list = []
	for d in datelist:
		type_y = type_dict[d]

		c = Counter(type_y)
		year_type_dict = dict(c)

		sorted_x = sorted(year_type_dict.items(), key=operator.itemgetter(1), reverse=True)
		print( sorted_x )

		d1 = {}
		for i in list(range(len(sorted_x))):
			type_id = sorted_x[i][0]
			d1[ sorted_type[i] ] = type_id

		map_res_list.append( d1 )

	print(map_res_list)

	with open("sugarcane_type_map.txt", "wb") as fp:
		pickle.dump(map_res_list, fp)









def get_type_percentage(year, needed_ij_list):
	# with open("type_dict.json", "r") as fp:
	# 	type_dict = json.load(fp)


	with open("sugarcane_type_map.txt", "rb") as fp:
		map_res_list = pickle.load(fp)

	with open("./cluster_info_dict/cluster_info_{}.txt".format(str(year)[2:]), "rb") as fp:
		cluster_dict = pickle.load(fp)




	datelist = ["20180809", "20190804"]
	cluster_res = 1
	if year == 2018:
		# do cluster
		# cluster_res = type_dict[ datelist[0] ]
		map_res_dict = map_res_list[0]
	elif year == 2019:
		# cluster_res = type_dict[ datelist[1] ]
		map_res_dict = map_res_list[1]
	else:
		cluster_res = None

	# start calculating
	print(year)
	# print(len(cluster_res))
	sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]

	if cluster_res is not None:

		type_list = []
		for ij in tqdm(needed_ij_list):
			noIndex = False
			try:
				# ind = sugarcane_pos.index( [ij[0], ij[1]] )
				type_y = cluster_dict[ "{}-{}".format(ij[0],ij[1]) ]
			except KeyError:
			# except ValueError:
				noIndex = True
			if noIndex == True:
				continue


			# type_y = cluster_res[ind] 
			type_list.append(type_y)



		c = Counter(type_list)
		year_type_dict = dict(c)
		sorted_x = sorted(year_type_dict.items(), key=operator.itemgetter(1), reverse=True)

		inv_map = {v: k for k, v in map_res_dict.items()}

		res_dict = {}
		for term in sorted_x:
			k = term[0]
			new_k = inv_map[k]
			res_dict[new_k] = term[1]
	
	else:
		res_dict = None

	return res_dict 




if __name__ == '__main__':
	datelist = ["20180809", "20190804"]
	NUM_TYPE = 13

	# type_dict = {}

	"""
	for d in datelist:
		type_y = clustering(d, NUM_TYPE)
		type_dict[d] = type_y

	with open("type_dict.json", "w") as fp:
		json.dump(type_dict, fp)
	"""

	# map_type()


	print("finish")






