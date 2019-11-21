import pandas as pd
import numpy as np
from datetime import datetime
import json
import math
from tqdm.auto import tqdm







if __name__ == '__main__':
	
	with open("./T55KFT_total_ndvi_list.json", "r") as fp:
		total_ndvi_list_T55KFT = json.load(fp)


	for key, value in tqdm( total_ndvi_list_T55KFT.items() ):
		datestr = key[:8]
		tmp_dict = { datestr: value }

		with open("ndvi_list_"+datestr+".json", "w") as fp:
			json.dump(tmp_dict, fp)

	print("finish")