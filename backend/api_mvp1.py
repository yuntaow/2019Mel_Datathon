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

from GenerateGeoJSON import GetLatLongForCoords


app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('ratoonStartDate')  # 2016-12-22 to 2019-08-09
parser.add_argument('harvestStartDate') # 2016-12-22 to 2019-08-09
parser.add_argument('latlonlist', type=float, action='append')	 # 0 - 64


ndvi_time_df = pd.read_csv("tile_xy_ndvi_dict.csv")
timeseries_list = ndvi_time_df["time"].values.tolist()
ndvi_df = ndvi_time_df.drop(["time"], axis=1)
tile_list = ndvi_df.columns.tolist()

lat_origin,lon_origin = -19.893321306346,147.9552989984   # (0,0) the origin
SUGAR_JSON = "./FullSugar.geojson"
with open(SUGAR_JSON) as f:
	features = json.load(f)["features"]

def latlon_to_xy(lat1,lon1,lat2,lon2):
	dx = abs(lon1-lon2)*40000*math.cos((lat1+lat2)*math.pi/360)/360
	dy = abs(lat1-lat2)*40000/360
	print(dx*1000/10, " ",dy*1000/10)   # answer in km
	return [math.floor(dx*1000/10), math.floor(dy*1000/10)]


def NDVI_func(x, m, a, b, ti, tf):
	return m / ( 1 +  np.exp((-1) * a * (x - ti)))  -  m / ( 1 +  np.exp((-1) * b * (x - tf)))


class YieldEstimateion(Resource):
	def get(self):
		return {'hello': 'world'}


	def post(self):
		args = parser.parse_args()
		ratoonStartDate, harvestStartDate, latlonlist = args['ratoonStartDate'], args['harvestStartDate'], args['latlonlist']
		
		# topleft = latlonlist[0]
		topleft_lon = latlonlist[0]
		topleft_lat = latlonlist[1]
		bottomright_lon = latlonlist[2]
		bottomright_lat = latlonlist[3]


		[top_x,top_y] = latlon_to_xy(lat_origin,lon_origin,topleft_lat,topleft_lon)
		[bottom_x,bottom_y] = latlon_to_xy(lat_origin,lon_origin,bottomright_lat,bottomright_lon)


		inputGeo = { "type": "Polygon", "coordinates": [[ [ topleft_lon, topleft_lat ], \
												 [ bottomright_lon, topleft_lat ], \
												 [ bottomright_lon, bottomright_lat ], \
												 [ topleft_lon, bottomright_lat ], \
												 [ topleft_lon, topleft_lat ] ]]  }

		inputGeo_go = geometry.GeometryCollection([geometry.shape(inputGeo).buffer(0)])
		result=geometry.GeometryCollection()   # sugarcane masks that intersects tile
		for k in features:
			if geometry.shape(k["geometry"]).intersects(inputGeo_go):
				result=result.union(geometry.shape(k["geometry"]).intersection(inputGeo_go))
		needed_ij_list = []
		if inputGeo_go.intersects( result ):
			# find the mask in the input region
			for i in list(range(top_x, bottom_x)):
				for j in list(range(top_y, bottom_y)):
					lat_long=GetLatLongForCoords(i,j)
					if result.intersects(geometry.Point(lat_long)):
						# this coordinate is needed
						needed_ij_list.append((i,j))


		"""
		tile = tile_list[int(regionId)]
		ndvi_list = ndvi_df[tile].values.tolist()

		ratoonStartDate_do = datetime.strptime(ratoonStartDate, '%Y-%m-%d')
		harvestStartDate_do = datetime.strptime(harvestStartDate, '%Y-%m-%d')

		timeseries_do = []
		for d in timeseries_list:
			do = datetime.strptime(d, '%Y-%m-%d')
			timeseries_do.append(do)
		
		appr_ratoonStartDate_do = min(timeseries_do, key=lambda x:abs(x - ratoonStartDate_do ))
		appr_harvestStartDate_do = min(timeseries_do, key=lambda x:abs(x - harvestStartDate_do ))

		appr_ratoonStartDate = appr_ratoonStartDate_do.strftime('%Y-%m-%d')
		appr_harvestStartDate = appr_harvestStartDate_do.strftime('%Y-%m-%d')

		ratoon_ind = timeseries_list.index(appr_ratoonStartDate)
		harvest_ind = timeseries_list.index(appr_harvestStartDate)

		ydata = np.array( ndvi_list[ratoon_ind : harvest_ind] )
		xdata = np.array( list(range(0, len(ydata))) )

		def fun(x, t, y):
			m, a, b, ti, tf = x[0], x[1], x[2], x[3], x[4]
			return NDVI_func(t, m, a, b, ti, tf) - y
		x0 = np.ones(5)
		res_lsq = least_squares(fun, x0, args=(xdata, ydata))
		m, a, b, ti, tf = res_lsq.x[0], res_lsq.x[1], res_lsq.x[2], res_lsq.x[3], res_lsq.x[4]
		I = quad(NDVI_func, 0, 17, args=(m, a, b, ti, tf) )
		estimated_greensum_integral = I[0]

		print( estimated_greensum_integral )

		k = 66.0 / 7.418822410624586

		predicted_yield = k * estimated_greensum_integral
		"""
		predicted_yield = needed_ij_list


		return { "estimated_yield" : predicted_yield }


api.add_resource(YieldEstimateion, '/yield_estimation')

if __name__ == '__main__':
	app.run(debug=True)


