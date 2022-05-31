# This worker, regularly searches the database for paid orders and if such
# order exists (for sticker or canvas), it will start the printing process
# and then sets the orders to status 'PRINTED'

import psycopg2
from PIL import Image
from Worker import url2image, Worker
from Order import Order
from Printer import printStickers
import pprint
import time # Sleep
import pprint

# Database to connect to
DATABASE="d2g4rqtoq85egv"
USER="unhgkzonxftvtx"
PASSWORD="a4941dce83a26747a5008846c26b54523d17c139df77294bde96a2313829578f"
HOST="ec2-52-18-116-67.eu-west-1.compute.amazonaws.com"
PORT="5432"

# Create worker
worker = Worker(database=DATABASE, 
                user=USER, 
                password=PASSWORD, 
                host=HOST, 
                port=PORT)

# Main loop
WORKER_RUNNING = True
WORKER_LOOP_DELAY = 5 # Seconds
ITERATION_COUNT = 1
while WORKER_RUNNING:
    # Sleep
    print(f"ITERATION_COUNT: {ITERATION_COUNT}")
    ITERATION_COUNT += 1
    time.sleep(WORKER_LOOP_DELAY)

    # Fetch PAID orders and start printing,
    # after each printed order, set order state to 'PRINTED'
    worker.find_and_parse(order_status="PAID")

    # Check if there are any orders
    if len(worker.orders_and_items):
        pprint.pprint(f"To be printed orders: {worker.orders_and_items}")

        # Create order and sticker object instances if 
        orders = []
        for order_id in worker.orders_and_items:
            orders.append(Order(order_id=order_id, order_status='PAID', orderArray=worker.orders_and_items[order_id]))

        # Print orders
        printStickers(orders)

        # Set order statuses for these orders as 'PRINTED'
        for order in orders:
            # Set new status for the printed order
            print(f"Order with id: {order_id} set to status PRINTED")
            worker.setOrderStatus(order_id=order.order_id, status="PRINTED")
        
        # Remove orders
        orders = []
    else:  
        print(f"No orders in queue")


    




