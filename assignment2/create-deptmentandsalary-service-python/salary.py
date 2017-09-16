from flask import Flask, jsonify, make_response, request
import pika;
import ast;

import pymysql.cursors
conn= pymysql.connect(host='mysql-container',user='salaryuser',passwd='ThePassword',db='salarydb',autocommit=True,cursorclass=pymysql.cursors.DictCursor)
curr=conn.cursor()

app = Flask(__name__)

connection = pika.BlockingConnection(pika.ConnectionParameters(host='rmq-container'))

channel = connection.channel()

channel.queue_declare(queue='create-salary-queue');


def addSalary(designation,dept,pay):
    ''' Greet the user '''
    # designation=request.form['designation']
    print('designation -> ' + designation)
    # dept=request.form['dept']
    print('dept -> ' + dept)
    # pay=request.form['pay']
    print('pay -> ' + pay)


    try:
        query = "INSERT INTO salaryslab (dept,designation,pay) VALUES ( '%s', '%s', '%s')"%(dept,designation,pay)
        print("query-> " + query)

        curr.execute(query)
        return "added"
    except Exception:

        return "error in query"


def on_request(ch, method, props, body):



    # json payload
    # str_body = str(body)
    # req_dict = ast.literal_eval(str_body)
    # print 'req_dict ->', str_body
    # stripped=str_body[2:-1]
    # designation = req_dict['designation']
    # dept = req_dict['dept']
    # pay = req_dict['pay']
     # json payload ends


    str_body=str(body);
    print(str_body);
    stripped=str_body[2:-1]
    print()
    designation=stripped.split(',')[0];
    dept=stripped.split(',')[1];
    pay=stripped.split(',')[2];


    response = addSalary(designation,dept,pay);

    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = \
                                                         props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag = method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(on_request, queue='create-salary-queue')

print(" [x] Awaiting RPC requests")
channel.start_consuming()



@app.route('/', methods=['GET'])
def hello():
    ''' Greet the user '''
    return "hello service is up"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)


# @app.route('/getAllSalarySlab', methods=['GET'])
# def getAllSalaryInfo():
#     ''' Greet the user '''
#     global allSalaryInfo
#     result = "select * from salaryslab"
#     curr.execute(result)
#     data= curr.fetchall();
#     print(type(data))
#     print (data)
#     global allSalaryInfo
#     allSalaryInfo=jsonify(result=data)
#     print(type(allSalaryInfo))
#     return allSalaryInfo


# @app.route('/getAllSalarySlab/<dept>/<designation>', methods=['GET'])
# def getaSingleSalaryInfo(dept,designation):
#     query="select pay from salaryslab where dept ='%s' AND designation = '%s' "%(dept,designation)
#     #query="select pay from salaryslab"
#     curr.execute(query)
#     data=curr.fetchone()
#     return jsonify(data)




