import time                   # To time processes
import warnings               # To suppress warnings

import numpy as np            # Data manipulation
#import pylab as pl
#import pandas as pd           # Dataframe manipulatio
#from matplotlib import pyplot
#mport matplotlib.pyplot as plt          # For graphics
#import seaborn as sns
import plotly.plotly as py #For World Map
import plotly.graph_objs as go
from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
#init_notebook_mode(connected=True)

from sklearn.preprocessing import StandardScaler  # For scaling dataset
from sklearn.cluster import KMeans, AgglomerativeClustering, AffinityPropagation #For clustering
from sklearn.mixture import GaussianMixture #For GMM clustering

import os                     # For os related operations
import sys                    # For data size

f = open("Meteorite_Landings.csv")
f.readline()
data = np.loadtxt(fname=f, dtype=float, delimiter=",")

kmeans = KMeans(n_clusters=7, random_state=10).fit(data)
labels = kmeans.labels_

file = open("Meteorite_Labels.csv", "w")

file.write("reclat,reclong,label\n")

for i in range (0, labels.size):
    file.write(str(data[i][0]) + "," + str(data[i][1]) + "," + str(labels[i] + 2) + '\n')

file.close()