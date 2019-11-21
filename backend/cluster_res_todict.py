import pandas as pd
import numpy as np
from datetime import datetime
import json
import math
from tqdm.auto import tqdm

import pickle

from utilfunc import *


with open("T55KFT_sugarcane_positions.json", "r") as fp:
	tile_sugarcane_position_dict = json.load(fp)






if __name__ == '__main__':
	sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]

	with open("type_dict.json", "r") as fp:
		type_dict = json.load(fp)

	with open("sugarcane_type_map.txt", "rb") as fp:
		map_res_list = pickle.load(fp)

	datelist = ["20180809", "20190804"]

	map_res_dict_18 = map_res_list[0]
	map_res_dic_19 = map_res_list[1]

	cluster_res_18 = type_dict[ datelist[0] ]
	cluster_res_19 = type_dict[ datelist[1] ]


	print(type(cluster_res_18))
	print(len(cluster_res_18))


	cluster_dict = {}
	for i in tqdm(list(range(len(cluster_res_18)))):
		pos = sugarcane_pos[i]
		cluster_dict["{}-{}".format(pos[0],pos[1])] = cluster_res_18[i]


	with open("./cluster_info_dict/cluster_info_{}.txt".format(18), "wb") as fp:
		pickle.dump(cluster_dict, fp)



	cluster_dict = {}
	for i in tqdm(list(range(len(cluster_res_19)))):
		pos = sugarcane_pos[i]
		cluster_dict["{}-{}".format(pos[0],pos[1])] = cluster_res_19[i]


	with open("./cluster_info_dict/cluster_info_{}.txt".format(19), "wb") as fp:
		pickle.dump(cluster_dict, fp)


