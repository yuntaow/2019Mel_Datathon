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



def func(datestr):
	with open("./ndvi_info/ndvi_list_{}.json".format(datestr), "r") as fp:
		tile_ndvi_dict = json.load(fp)

	sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]

	tile_ndvi_list = tile_ndvi_dict[datestr]

	ndvi_dict = {}
	for i in list(range(len(tile_ndvi_list))):
		pos = sugarcane_pos[i]

		ndvi_dict["{}-{}".format(pos[0],pos[1])] = tile_ndvi_list[i]


	with open("./ndvi_info_dict/ndvi_list_{}.txt".format(datestr), "wb") as fp:
		pickle.dump(ndvi_dict, fp)



if __name__ == '__main__':
	filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"

	date_list = get_timeseries(filepath)

	for d in tqdm(date_list):
		dl = d.split('-')
		datestr = "{}{}{}".format(dl[0],dl[1],dl[2])

		func(datestr)

	print("finish")





