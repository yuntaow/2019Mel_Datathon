from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import pandas as pd
import numpy as np
from datetime import datetime
from scipy.optimize import least_squares
from scipy.integrate import quad
import json
import math
from shapely import geometry

from flask_cors import CORS

from yield_calculation import *
from yield_forecast import *
from sugarcane_clustering import *

# from GenerateGeoJSON import GetLatLongForCoords


app = Flask(__name__)
api = Api(app)

CORS(app)


parser = reqparse.RequestParser()
parser.add_argument('ratoonStartDate')  # 2016-12-22 to 2019-08-09
parser.add_argument('harvestStartDate') # 2016-12-22 to 2019-08-09
parser.add_argument('latlonlist', action='append')	 # 0 - 64

parser.add_argument('futureDate')
parser.add_argument('drought')
# ndvi_time_df = pd.read_csv("tile_xy_ndvi_dict.csv")
# timeseries_list = ndvi_time_df["time"].values.tolist()
# ndvi_df = ndvi_time_df.drop(["time"], axis=1)
# tile_list = ndvi_df.columns.tolist()

with open("./T55KFT_mean_ndvi_total_2.json", "r") as fp:
    ndvi_dict_T55KFT = json.load(fp)



# need to split this into different dates 
# with open("./T55KFT_total_ndvi_list.json", "r") as fp:
#     total_ndvi_list_T55KFT = json.load(fp)


with open("T55KFT_sugarcane_positions.json", "r") as fp:
	tile_sugarcane_position_dict = json.load(fp)


lat_origin,lon_origin = -19.893321306346,147.9552989984   # (0,0) the origin
SUGAR_JSON = "./FullSugar.geojson"
with open(SUGAR_JSON) as f:
	features = json.load(f)["features"]

def latlon_to_xy(lat1,lon1,lat2,lon2):
	dx = abs(lon1-lon2)*40000*math.cos((lat1+lat2)*math.pi/360)/360
	dy = abs(lat1-lat2)*40000/360
	print(dx*1000/10, " ",dy*1000/10)   # answer in km
	return [math.floor(dx*1000/10), math.floor(dy*1000/10)]


def latlon_to_xy2(lat1,lon1,lat2,lon2):
	dis_x = GetDistanceMeters([lat1,lon1], [lat1,lon2])
	dis_y = GetDistanceMeters([lat1,lon1], [lat2,lon1])
	x = dis_x / 10
	y = dis_y / 10

	return [math.floor(x), math.floor(y)]


def NDVI_func(x, m, a, b, ti, tf):
	return m / ( 1 +  np.exp((-1) * a * (x - ti)))  -  m / ( 1 +  np.exp((-1) * b * (x - tf)))


class YieldEstimateion(Resource):
	def get(self):
		return {'hello': 'world'}


	def post(self):
		args = parser.parse_args()
		ratoonStartDate, harvestStartDate, latlonlist = args['ratoonStartDate'], args['harvestStartDate'], args['latlonlist']
		
		latlonlist_processed = []
		print(latlonlist)
		"""
		for latlon_dict in latlonlist:
			res_latlon_dict = json.loads(latlon_dict.replace("\'", "\""))
			lon, lat = res_latlon_dict["lon"], res_latlon_dict["lat"]
			latlonlist_processed.append( [lon, lat] )

		print(latlonlist_processed)
		"""

		l_latlonlist = len(latlonlist)

		num_point = int(l_latlonlist / 2)

		for i in list(range(num_point)):
			lon, lat = latlonlist[i*2], latlonlist[i*2+1]
			latlonlist_processed.append( [float(lon), float(lat)] )
		print(latlonlist_processed)


		inputGeo = { "type": "Polygon", "coordinates": [ latlonlist_processed ]  }
		inputGeo_go = geometry.GeometryCollection([geometry.shape(inputGeo).buffer(0)])

		# need to find the max lat lon and min lat lon
		maxlon = max([latlon[0] for latlon in latlonlist_processed])
		minlon = min([latlon[0] for latlon in latlonlist_processed])

		maxlat = max([latlon[1] for latlon in latlonlist_processed])
		minlat = min([latlon[1] for latlon in latlonlist_processed])

		print("maxlon ",maxlon, "minlon ",minlon)
		print("maxlat ",maxlat, "minlat ",minlat)

		# construct a wrapper rectangular polygon
		wrapperGeo = { "type": "Polygon", "coordinates": [ [ [minlon, maxlat],\
															 [maxlon, maxlat],\
															 [maxlon, minlat],\
															 [minlon, minlat],\
															 [minlon, maxlat]
															] ]  }
		wrapperGeo_go = geometry.GeometryCollection([geometry.shape(wrapperGeo).buffer(0)])

		[top_x,top_y] = latlon_to_xy(lat_origin,lon_origin,maxlat,minlon)
		[bottom_x,bottom_y] = latlon_to_xy(lat_origin,lon_origin,minlat,maxlon)


		print("dis is ", latlon_to_xy2(lat_origin,lon_origin,maxlat,minlon))
		print("dis is ", latlon_to_xy2(lat_origin,lon_origin,minlat,maxlon))

		result=geometry.GeometryCollection()   # sugarcane masks that intersects tile
		for k in features:
			if geometry.shape(k["geometry"]).intersects(inputGeo_go):
				result=result.union(geometry.shape(k["geometry"]).intersection(inputGeo_go))

		# this is for proserpine 
		latlon_tile = [(147.95529899839866, -19.893321306080015), \
				   (149.01671779369045, -19.893321306080015), \
				   (149.01671779369045, -20.876176661128618), \
					(147.95529899839866, -20.876176661128618)]

		top_left_lat_long, top_right_lat_long, bottom_right_lat_long, bottom_left_lat_long = latlon_tile[0], latlon_tile[1],\
																			latlon_tile[2], latlon_tile[3]


		fullImageWidth = 10980
		fullImageHeight = 10980

		needed_ij_list = []
		print(top_x, bottom_x, top_y, bottom_y)
		# 6456 6463 5693 5717
		if inputGeo_go.intersects( result ):
			# find all the sugarcane xy positions in this input region
			sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]


			for i in tqdm(list(range(top_x, bottom_x))):
				for j in list(range(top_y, bottom_y)):
					# if [i,j] in sugarcane_pos:
					# 	needed_ij_list.append((i,j))

					
					lat_long=GetLatLongForCoords(i,j, top_left_lat_long, top_right_lat_long,  bottom_right_lat_long, bottom_left_lat_long, fullImageWidth, fullImageHeight)
					if result.intersects(geometry.Point(lat_long)):

						# this coordinate is needed
						needed_ij_list.append((i,j))
					


		


			# if all needed ij is found 
			# get the NDVI of these xy positions 
			# dont need to calculate it again

			print("Got needed ij")
			print(len(needed_ij_list))

			if len(needed_ij_list) == 0:
				return { "errorCode" : 1  }

			filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"
			daterange = [ratoonStartDate, harvestStartDate]
			"""
			sugarpositions = needed_ij_list
			ndvi_dict = get_custom_ndvi(filepath, daterange, sugarpositions)
			mean_ndvi_list = ndvi_dict["mean_ndvi_list"]
			date_list = ndvi_dict["date_list"]
			"""
			sugar_daterange = get_daterange(filepath, daterange)
			# sugarcane_pos = tile_sugarcane_position_dict["sugarcane_positions"]


			mean_ndvi_list = []
			for d in tqdm(sugar_daterange):
				date_info = d.split('-')
				image_name = "{}{}{}.tif".format(date_info[0], date_info[1], date_info[2])

				

				# tile_ndvi_list = T55KFT_total_ndvi_list[image_name]
				with open("./ndvi_info_dict/ndvi_list_{}.txt".format(image_name[:8]), "rb") as fp:
					# tile_ndvi_dict = json.load(fp)
					tile_ndvi_dict = pickle.load(fp)
				# tile_ndvi_list = tile_ndvi_dict[image_name[:8]]
				# print(type(tile_ndvi_dict))


				sub_ndvi_list = []
				for ij in tqdm(needed_ij_list):
					noIndex = False
					try:

						# ind = sugarcane_pos.index( [ij[0], ij[1]] )
						ndvi = tile_ndvi_dict[ "{}-{}".format(ij[0],ij[1]) ]
					except KeyError:
						noIndex = True
					if noIndex == True:
						continue

					# ndvi = tile_ndvi_list[ind]

					# print(ndvi)

					sub_ndvi_list.append(ndvi)
				
				mean_ndvi = np.mean(np.array(sub_ndvi_list))
				mean_ndvi_list.append(mean_ndvi)

			print(mean_ndvi_list)

			date_list = sugar_daterange

			"""
			date_list = ndvi_dict_T55KFT["date_list"]
			mean_ndvi_list = ndvi_dict_T55KFT["mean_ndvi_list"]
			"""


			reference_date = datetime.strptime( date_list[0], "%Y-%m-%d")
			days_elapsed_list = []
			for i in list(range(0, len(date_list))):
				do = datetime.strptime(date_list[i], "%Y-%m-%d")
				delta = do - reference_date
				delta_days = delta.days
				days_elapsed_list.append(delta_days)



			ydata = np.array( mean_ndvi_list )
			xdata = np.array( days_elapsed_list )

			def fun(x, t, y):
				m, a, b, ti, tf = x[0], x[1], x[2], x[3], x[4]
				return NDVI_func(t, m, a, b, ti, tf) - y

			x0 = np.ones(5)
			res_lsq = least_squares(fun, x0, args=(xdata, ydata))
			m, a, b, ti, tf = res_lsq.x[0], res_lsq.x[1], res_lsq.x[2], res_lsq.x[3], res_lsq.x[4]
			I = quad(NDVI_func, 0, xdata[-1], args=(m, a, b, ti, tf) )
			integrals = I[0]

			# print( estimated_integral )
			print(integrals)
			print(days_elapsed_list)
			k = 0.47352

			estimated_yield = k * float(integrals)
			print(estimated_yield)

			predicted_yield_list = []
			for i in list(range(len(days_elapsed_list))):
				I = quad(NDVI_func, 0, i, args=(m, a, b, ti, tf) )
				integrals = I[0]
				predicted_yield = k * integrals
				predicted_yield_list.append(predicted_yield)




			# get type clustering
			# year = int(harvestStartDate[:4])

			if ratoonStartDate == "2017-09-23":
				year = 2018
			elif ratoonStartDat == "2018-09-28":
				year = 2019
			else:
				print("error")


			type_dict = get_type_percentage(year, needed_ij_list)




			# calculate Area and tons
			square_meter_area = len(needed_ij_list) * 100
			hec = square_meter_area * 0.0001
			estimated_tons = estimated_yield * hec

			sugar_content = 0.1 * estimated_tons

			sugar_lbs = sugar_content * 2000
			global_sugar_price = 12.72

			revenue = global_sugar_price * sugar_lbs

			return { "errorCode":0, "estimated_yield" : estimated_yield, "mean_ndvi_list": mean_ndvi_list,  "date_list": date_list, "days_elapsed_list": days_elapsed_list, "predicted_yield_list": predicted_yield_list, "type_clustering": type_dict, "estimated_tons": estimated_tons, "sugar_content": sugar_content, "revenue": revenue }
		
		else:
			# the selected region does not contain any sugarcane 
			print("No sugarcane in this region")
			estimated_yield = -1
			



			return { "errorCode" : 1  }




api.add_resource(YieldEstimateion, '/yield_estimation')



class ForecastYield(Resource):
	def get(self):
		return {'hello': 'world'}


	def post(self):
		args = parser.parse_args()
		futureDate, drought = args['futureDate'], args['drought']

		forecast_ndvi = train_timeseries_and_predict(futureDate, drought)

		default_ratoonStartDate = "2019-09-28"

		date_list = ndvi_dict_T55KFT["date_list"]
		mean_ndvi_list = ndvi_dict_T55KFT["mean_ndvi"]

		ind = date_list.index(default_ratoonStartDate)
		date_list_19 = date_list[ind:]
		mean_ndvi_list_19 = mean_ndvi_list[ind:]

		date_list_19.append(futureDate)
		mean_ndvi_list_19.append(forecast_ndvi)

		reference_date = datetime.strptime( date_list_19[0], "%Y-%m-%d")
		days_elapsed_list = []
		for i in list(range(0, len(date_list_19))):
			do = datetime.strptime(date_list_19[i], "%Y-%m-%d")
			delta = do - reference_date
			delta_days = delta.days
			days_elapsed_list.append(delta_days)


		print(mean_ndvi_list_19)
		print(days_elapsed_list)
		ydata = np.array( mean_ndvi_list_19 )
		xdata = np.array( days_elapsed_list )


		def fun(x, t, y):
			m, a, b, ti, tf = x[0], x[1], x[2], x[3], x[4]
			return NDVI_func(t, m, a, b, ti, tf) - y

		x0 = np.ones(5)
		res_lsq = least_squares(fun, x0, args=(xdata, ydata))
		m, a, b, ti, tf = res_lsq.x[0], res_lsq.x[1], res_lsq.x[2], res_lsq.x[3], res_lsq.x[4]
		I = quad(NDVI_func, 0, xdata[-1], args=(m, a, b, ti, tf) )
		integrals = I[0]

		# print( estimated_integral )

		k = 0.47352

		estimated_yield = k * float(integrals)

		return { "estimated_yield" : estimated_yield, "estimated_ndvi": forecast_ndvi }






		


api.add_resource(ForecastYield, '/forecast')

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')


