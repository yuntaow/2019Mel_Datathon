from PIL import Image
import numpy as np
import rasterio
import utm
from pyproj import Proj, transform





if __name__ == '__main__':
	filepath = "/mnt/volume_sgp1_01/pepsL2A_processed_img/T55KFT/split_dates/"

	# im = Image.open(filepath+"20161222.tif")
	# imarray = np.array(im)
	# print(imarray.shape)

	# im = tiff.imread(filepath+"20161222.tif")
	# print(im.shape)



	dataset = rasterio.open(filepath+"20161222.tif")
	print(dataset.count)
	print(dataset.width)
	print(dataset.height)
	print(dataset.indexes)

	topleft = dataset.transform * (0, 0)
	print(topleft)
	dataset_crs = dataset.crs
	print(dataset_crs)
	print(type(dataset_crs))
	print(dataset_crs.to_string())
	dataset_crs_str = dataset_crs.to_string()
	print(dataset.bounds)

	# zone_num = dataset_crs_str[-2:]
	# latlon = utm.to_latlon(topleft[0], topleft[1], int(zone_num), 'S')
	# print(latlon)

	# Get top left corner, lat and long

	inProj = Proj(init=dataset_crs_str)
	outProj = Proj(init='epsg:4326')   # epsh:4326 means latlon
	x1,y1 = topleft[0], topleft[1]
	x2,y2 = transform(inProj,outProj,x1,y1)
	print(x2, " ", y2)

	band1 = dataset.read(1)
	print(band1.shape)

