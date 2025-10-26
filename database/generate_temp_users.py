from datetime import datetime
import random
import csv
import pandas as pd
import os
import uuid

# import numpy as np

now = datetime.now()

User_Information = []
Product_Information = []
Shopping_Carts = []
Chats = []
Messages = []
Catagory_Assigned_Products = []
Catagory_Tags = []
Reports = []
Reviews = []

Tables = {
    "User_Information": User_Information, 
    "Product_Information": Product_Information,
    "Shopping_Carts": Shopping_Carts, 
    "Chats": Chats,
    "Messages": Messages, 
    "Catagory_Assigned_Products": Catagory_Assigned_Products, 
    "Catagory_Tags": Catagory_Tags,
    "Reports": Reports,
    "Reviews": Reviews
}

num_users_low = 0
num_users_high = 9
rowsToGenerate = 10

uuidList = []

for i in range(rowsToGenerate):
    uuidList.append(str(uuid.uuid4()))
    
def generate_distinct_uuid():
    uuid1 = uuidList[random.randint(num_users_low, num_users_high)]
    uuid2 = uuidList[random.randint(num_users_low, num_users_high)]
    while(uuid1 == uuid2):
        uuid1 = uuidList[random.randint(num_users_low, num_users_high)]
        uuid2 = uuidList[random.randint(num_users_low, num_users_high)]
    return uuid1, uuid2

def generate_distinct():
    num1 = random.randint(num_users_low, num_users_high)
    num2 = random.randint(num_users_low, num_users_high)
    while(num1 == num2):
        num1 = random.randint(num_users_low, num_users_high)
        num2 = random.randint(num_users_low, num_users_high)
    return num1, num2

def generateUserData():
    User_Information.append(['id', 'supabase_id', 'first_name', 'last_name', 'email', 'user_name', 'deleted_on', 'is_deleted', 'is_flagged', 'flagged_type', 'created_at'])
    for i in range(rowsToGenerate):
        user = [
        i,
        uuidList[i],
        f"FirstName{i}",
        f"LastName{i}",
        # f"{random}{random.randint(100, 999)}@mtroyal.ca",
        f"TestUser{i}@mtroyal.ca",
        f"username{i}",
        None,
        False,
        False,
        None,
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")]
        User_Information.append(user)
        
def generateProductData():
    Product_Information.append(['id', 'user_id', 'title', 'description', 'image', 'price', 'stock_count', 'created_at'])
    for i in range(rowsToGenerate):
        product = [
        i,
        uuidList[random.randint(num_users_low, num_users_high)],
        f"productName{i}",
        "This product has no description",
        False,
        f"{i}.{99}",
        random.randint(1, 10),
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        ]
        Product_Information.append(product)
        
def generateShoppingCartData():
    Shopping_Carts.append(['id', 'user_id', 'product_id', 'created_at'])
    for i in range(rowsToGenerate):
        cart = [
        i,
        uuidList[random.randint(num_users_low, num_users_high)],
        random.randint(num_users_low, num_users_high),
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        ]
        Shopping_Carts.append(cart)
 
def generateChatData():
    Chats.append(['id', 'user_id_1', 'user_id_2', 'created_at'])
    for i in range(rowsToGenerate):
        uuid1, uuid2 = generate_distinct_uuid()
        chat = [
        i,
        uuid1,
        uuid2,
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        ]
        Chats.append(chat)
        
def generateMessagesData():
    Messages.append(['id', 'chat_id', 'sender_id', 'logged_message', 'created_at'])
    for i in range(rowsToGenerate):
        message = [
        i,
        random.randint(num_users_low, num_users_high),
        uuidList[random.randint(num_users_low, num_users_high)],
        "This is not a real message",
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        ]
        Messages.append(message)

def generateCatagoryAssignedProductsData():
    Catagory_Assigned_Products.append(['category_id', 'product_id', 'created_at'])
    for i in range(rowsToGenerate):
        catAP = [
        random.randint(num_users_low, num_users_high),
        random.randint(num_users_low, num_users_high),
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        ]
        Catagory_Assigned_Products.append(catAP)
        
def generateCatagoryTagsData():
    Catagory_Tags.append(['id', 'name', 'description', 'created_at'])
    for i in range(rowsToGenerate):
        catTag = [
        i,
        f"Category{i}",
        "This category has no description",
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        ]
        Catagory_Tags.append(catTag)
        
def generateReportsData():
    Reports.append(['id', 'created_by_id', 'created_on_id', 'linked_information', 'closed_date', 'is_closed', 'created_at'])
    for i in range(rowsToGenerate):
        uuid1, uuid2 = generate_distinct_uuid()
        report = [
        i,
        uuid1,
        uuid2,
        None,
        None,
        False,
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        ]
        Reports.append(report)

def generateReviewsData():
    Reviews.append(['id', 'created_by_id', 'created_on_id', 'product_id', 'rating', 'description', 'created_at'])
    for i in range(rowsToGenerate):
        uuid1, uuid2 = generate_distinct_uuid()
        review = [
        i,
        uuid1,
        uuid2,
        random.randint(num_users_low, num_users_high),
        random.randint(1, 5),
        "This review has no description",
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        ]
        Reviews.append(review)
    
generateUserData()
generateProductData()
generateShoppingCartData()
generateChatData()
generateMessagesData()
generateCatagoryAssignedProductsData()
generateCatagoryTagsData()
generateReportsData()
generateReviewsData()

for name, arr in Tables.items():
    print(f"\n{name}: {arr}")
    
for name, arr in Tables.items():
    df_table = pd.DataFrame(arr[1:], columns=arr[0])
    df_table.to_csv(f"./Table csv's/{name}.csv", index=False)
    
