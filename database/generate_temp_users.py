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
Category_Assigned_Products = []
Category_Tags = []
Reports = []
Reviews = []
User_Interactions = []

Tables = {
    "User_Information": User_Information, 
    "Product_Information": Product_Information,
    "Shopping_Carts": Shopping_Carts, 
    "Chats": Chats,
    "Messages": Messages, 
    "Category_Assigned_Products": Category_Assigned_Products, 
    "Category_Tags": Category_Tags,
    "Reports": Reports,
    "Reviews": Reviews,
    "User_Interactions": User_Interactions
    
}

num_users_low = 0
num_users_high = 100
rowsToGenerate = 20

uuidList = ["cdacee43-3b87-4dc2-be79-66e564289a58","21e777fb-e087-4ece-9c67-923cc1fa893b","f5814b43-6ab3-46dc-a240-22c9be3c7c3d","452912f1-a7c9-4949-b694-9433ac4fdd87","148b8e87-c66e-4533-8ef5-2955304cd907","d6d070c1-44c1-4e43-b8f3-d70412426881","51f28079-686d-460c-aaf7-143baabe97cb","140d719a-f2b9-48d6-8b84-7521a7b607aa","6e0b467c-f801-457d-afbd-474eb24c154d","d2110d57-8220-4ae8-a2bd-f4deb3d94d22","cd85a7cb-84d3-4923-8f5e-5093141543b6","040b853a-0608-4bf1-bdd0-4ceec9434148","3095fdb4-2b17-42d6-8b6b-d3cbe8e6d008","42ad416a-d94a-4bf4-b554-f0a05c803271","f9f4fde1-1d17-4a4d-9f59-49db78c53caa","2e63e940-8a67-4bd3-bfe5-87c0e4b3675e","40b52411-17b5-424a-9ae1-5cfc5ee9ee1a","22df3768-72b6-4eb6-9620-bcc66ba8f42e","3f954a41-e9bc-49a7-85df-48949f0e57cc","745aaad2-0b0d-4e80-a87a-41b37f9a8fd5","488f83ee-d25a-4790-a90a-9b2730ebcfc6","2412984b-ce65-46f7-9721-43e5fc36a463","8e479e83-96da-4047-8fab-d602332fbea0","e0fc3ba0-4600-48c2-8605-d0529dbca485","a3277279-f8ef-4fe2-ab6d-b211473d2521","1cd2bb2e-b086-4497-ab84-05dea6175bee","fc00518a-413d-48b3-afd6-712698634425","a4d7fc88-2d53-4f9c-8d55-e40dd226f87c","f1ef8f03-ecea-4880-a472-cd8ee21917a6","2a922d23-11d4-47c8-9195-8de478f90ec8","00c3ce80-ab1e-4cf1-8279-90e2763fe866","6720b1d0-5aca-41b4-b6e8-c7cf250b70cb","2f46f550-7a33-424d-a443-8ebc52b554a6","3e070e42-b49a-4867-b7d7-e386817e2b30","b295a9fb-3000-44a7-80ed-017c9a169c80","ab7825d3-9f6c-4858-9568-6d41a1deac65","9e8fc41d-cdbd-4e0f-b886-a6b7bf188991","309fe5f9-f514-4282-a79f-967107ef3fd5","61459a49-fbee-473e-a874-179cbd0fcc23","5789cd98-a26d-47fc-844e-f00198f4c4b9","085e1d4e-3ef8-4844-ae4f-2e2e06756fe6","2c4ccc3d-9bcb-4840-a490-d825ce29b3d9","7c0986b6-1bc6-4bd1-a552-6ee1ffe0ae99","4df743b9-9046-405f-b4bb-34a40594a3cc","0056d111-3e4a-45e0-a94e-a06dae8e496e","2f0e7139-ed53-4c7e-aebc-6782a783594a","8aa4c293-daf1-4f10-abc6-71cf737fade6","219b4597-018a-4021-bc7d-6ca0c8ecc9e6","15dced78-9cea-4756-bb1e-21d8ecefb140","e56d13b5-6452-40d8-a6f6-2b0fa4825d16","1b9dcef0-91cb-467c-895c-ab516644781a","971de532-5a59-4606-bdf5-305107aa9006","53cd9db5-8de8-4aac-84f4-ff00a1d5536b","b0e054bc-3187-4299-acb2-1bdd9d2f0194","0b3c406c-09fd-4a2d-89b0-7c975d2e8387","e5e1c870-0eb0-4987-9330-4eb50d5a0b7b","3789101c-594c-4712-834a-f8697b43e626","c1b4f945-152f-4b77-ba6f-f6ab3145b6bc","c575c387-cfc5-41c1-8491-f34548abd940","909de392-db84-47d3-b514-aea5d7536b8a","8badb376-56de-437c-8a60-36de7f6310cf","a88c008c-7c34-4964-8085-f85a1c8be1f3","cb0762c4-4a99-4899-bd97-1c0dbaa1a21c","e9292654-8572-4ca7-9113-6339b2f81d0e","94946639-221f-4eac-9427-df2f5577506d","2715fd23-a32a-4263-9dfa-c255aeadb13b","00fcb8de-51dc-4571-9c5e-1c9e8160bc16","08ec4b3d-10c2-4309-86cb-e99a09852f11","ff37366d-a26a-4cad-93da-fce6eb31786f","590be0c8-636c-4770-adcd-542bcd361169","19a4fa03-babe-43a5-801d-e96c26969f09","9b9f65c5-af55-4d76-a702-7d32db3c3389","ad64c25b-32ca-403b-b6cb-b0e198ced6ee","f09cf58f-557c-43d2-bfa7-59c9051a601e","ed1df011-e7c8-4d03-9cc6-500190ca3fcb","348a135b-4292-4f6f-82d1-888f83b92c71","4d93da05-c864-4f8d-9ccf-2303c4b0e010","8b8669f3-3a7d-4883-9d68-671ceb94362b","9ba72e4e-744f-4256-94c9-26dd236d2ca6","a9de3856-aea8-4a3f-a413-4d1d9437232f","d60a5e2e-dc92-4588-bcf0-4075fe95beb3","e9b8758b-09f2-4301-ab2c-787d8f06e78c","8516197c-ebf4-4d6a-a29b-0a2d80b424f1","0172f1cd-fd6c-47a5-84eb-51db3ad0b191","91990c80-43ca-4010-8b93-5052fd9a4c1f","e6b82deb-3c85-4ba5-9df2-7289cc8f9520","0b6703ac-fdde-4e46-ab56-93f0a65bd6a5","c77dc88e-0a8b-43d1-b538-c919ca526ac9","84348c72-55fd-433c-a8bb-7581693cac60","752d07cb-76e8-49c3-960b-f295acadb9ac","854e3647-f1e4-4d63-9b25-0aa9a96c2f86","94dbdff9-e1c5-4711-9d59-9a6c78e7b190","64680efe-a418-4a4c-98d3-8985d9f486d3","de27c9c9-8ab0-4063-8ca4-62a2d995c2eb","41c11c2a-5576-422f-b14a-29442284a701","1798e439-9d9a-4abd-a434-e6339a6b52e1","f6b3efc2-8793-441c-9a45-0e3cd66e7f18","c3c7e9a8-abb4-430b-8e9f-3beb1723546d","3282cdb4-586d-4bce-a56d-1ab3f0ed760f","242b35f7-2562-4b59-a406-a04b10297bb2","f631cc91-215f-4f44-b12a-19a23951a1a2","f0464b1c-cf83-44bf-a321-786875407244"]
productList = []
chatList = []
categoryList = []

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
        productList[random.randint(num_users_low, num_users_high)],
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        ]
        Shopping_Carts.append(cart)
 
def generateChatData():
    Chats.append(['user_id_1', 'user_id_2'])
    seen = set()
    for i in range(rowsToGenerate):
        uuid1, uuid2 = generate_distinct_uuid()
        chat = tuple(sorted([uuid1, uuid2]))
        while(chat in seen):
            uuid1, uuid2 = generate_distinct_uuid()
            chat = tuple(sorted([uuid1, uuid2]))
        seen.add(chat)
        Chats.append(chat)
        
def generateMessagesData():
    Messages.append(['id', 'chat_id', 'sender_id', 'logged_message', 'created_at'])
    for i in range(rowsToGenerate):
        message = [
        i,
        chatList[random.randint(num_users_low, num_users_high)],
        uuidList[random.randint(num_users_low, num_users_high)],
        "This is not a real message",
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        ]
        Messages.append(message)

def generateCategoryAssignedProductsData():
    Category_Assigned_Products.append(['category_id', 'product_id', 'created_at'])
    for i in range(rowsToGenerate):
        catAP = [
        categoryList[random.randint(num_users_low, num_users_high)],
        productList[random.randint(num_users_low, num_users_high)],
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        ]
        Category_Assigned_Products.append(catAP)
        
def generateCategoryTagsData():
    Category_Tags.append(['id', 'name', 'description', 'created_at'])
    for i in range(rowsToGenerate):
        catTag = [
        i,
        f"Category{i}",
        "This category has no description",
        now.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        ]
        Category_Tags.append(catTag)
        
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
generateCategoryAssignedProductsData()
generateCategoryTagsData()
generateReportsData()
generateReviewsData()
generateUserInteractionsData()

for name, arr in Tables.items():
    print(f"\n{name}: {arr}")
    
for name, arr in Tables.items():
    df_table = pd.DataFrame(arr[1:], columns=arr[0])
    df_table.to_csv(f"./Table csv's/{name}.csv", index=False)
    
