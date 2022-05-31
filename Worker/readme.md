# Printer worker

### What

This folder contains Python files for running a worker that automatically checks the specified database in <b><i>worker.py</i></b>.

### Files in this directory

- <b>local_constants.py</b>
  - Local constants used by the scripts in the curernt directory
- <b>Order.py</b>
  - Order class definition used by the worker 
- <b>OrderSticker.py</b>
  - OrderSticker class definition used by the worker and Order object instance
- <b>Printer.py</b>
  - Application that communicates with the connected printer
- <b>Worker.py</b>
  - Worker class definition that manages database requests
- <b>worker.py</b>
  - Main script used to run the automatic printing

### Requierements 

##### Python

- <b>Python version</b>: 3.9.7
- <b>Python packages</b>: Specified in <b><i>requirements.txt</i></b> recommended way of installing the packages is to create a separate Python environment using for example conda environments (see https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) or Python venv module (see https://docs.python.org/3/library/venv.html)

##### Other
- <b>Connected printer</b>

### How to use the worker

#### 1. Meet specified requierements

#### 2. Modify the constants in worker.py defining database connection to connect to your database 

#### 3. Run <code>python worker.py</code>


