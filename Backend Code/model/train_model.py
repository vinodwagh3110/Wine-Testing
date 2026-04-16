import pandas as pd
import numpy as  np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

df = pd.read_csv("model\WineQT.csv")

X = df.drop(columns="quality" , axis=1)
y = df["quality"]

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42)


model = DecisionTreeClassifier()
model.fit(X_train,y_train)

prediction = model.predict(X_test)


pickle.dump(model , open("Wine_Model.pkl","wb"))
Quality_model = pickle.load(open("Wine_Model.pkl", "rb")) 