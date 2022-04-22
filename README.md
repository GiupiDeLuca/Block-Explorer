# Block-Explorer

### Description
The purpose of this program is to retrieve data from blocks in the Ropsten Test Network, in this case. 
I chose Ropsten rather than Mainnet, since it seems like a better choice in terms of transaction time and amount of data to deal with while developing. 


The program is pretty simple, and retrieves only a limited amount of data: the number of a block, the total value of the transactions in it, the addresses that have sent **ETH**, and the addresses that have received **ETH**. The program also specifies the amount of each transaction from a specific user type, either a *sender* or a *receiver*, and it tells if that specified address is a contract or not. 

This block explorer, called *Blox* (not very original, but still good for development), allows the user to either input a number representing how far back the search should go, or input two numbers representing the range of blocks the program should retrieve info about. 

For example inputting the number **2** would tell *Blox* to fetch info on the last two blocks, while inputting **12208345** **12208342** would tell *Blox* to retrieve info (in descending order) for blocks **12208345** **12208344** **12208343** **12208342**

### The Build
The first thing to do is to have access to the network, again **Ropsten** in this case, and the way to that is to have access to a node. I used **Moralis**. 

Once we have access to the node we can use tools, such as **Web3js**, to retrieve data from the blocks on the network. 

I thought that the best way to do so and keep everything simple and easy to read would be to create separate auxiliary functions that perform the individual tasks described above. 

`howMuchEth()` allows us to calculate the total value exchanged on the block, 
`isContract()` returns a boolean that tells us if an address is a contract or not,
`txByUser()` will group all the info on a transaction in a block based on the user type, either *sender* or a *receiver*, 
finally `exploreBlock()` uses all these functions to give us a nice and clean object (representing a block) displaying all the data retrieved. 

At this point the last step is to simply loop through the blocks the user wants to perform the query on, and *voila!* we got ourselves a block explorer. 

### How to run it
First thing is to install all dependencies with `npm install`. 

After that, from the root directory we can simply type in the terminal `node utils/rangeFunc.js` followed by either one or two integers. 

For example: `node utils/rangeFunc.js 2` will output all the info of the last two blocks, each represented in a *block object*

Running `node utils/rangeFunc.js 12208345 12208342` will instead give us all the info going from block **12208345** to block **12208342** inclusive. 

### Tests
In order to test this program we're going to use **Ganache** which will allow us to run tests on a local blockchain running on our machine. 

In a new terminal window we'll simply run `ganache`. We'll leave this running on our `localhost:8545`. 

On a separate terminal window we'll then run `truffle migrate --reset --network development`. This command will run a migration on our **Solidity** contracts. I've created a file called **Wallet.sol** in the *contracts* directory with a simple *Wallet* contract. 

The purpose is to give our newly created blockchain a little bit of action when running the migration. As you can see the migration script has a few account transacting, depositing and withdrawing. I didn't write any tests for this contract, but it's purpose is secondary in this case. 

Once we have run *Ganache* on our *localhost* and the migrations, it is time to run the test, using *Truffle* again, by simply running 

`truffle test test/tests.js`. 

The tests are pretty simple, and they cover only the basis. With more time I would have liked to have written a more thorough test suite for this project; checking for the right kind of user inputs as well as outputs, and covering some edge cases which could potentially leave the program exposed to bugs. 

### Next Steps
The first next step would surely be to make our testing a little bit more robust, make the code a little bit more efficient, and again, checking for other edge cases which are at the moment uncovered. 

After the backend is solid, I would move on and create the frontend. I have purposefully formatted the output of the program to make it easy to use in a frontend environment, such as **React**. 

### Conclusion
**Blox** (again with this name) is very far from perfect, but it's a pretty good starting point. The queries could be expanded, the user could have the possibility to have more specific inputs, the program itself could run faster. 

Overall it was a nice excercise and a good learning experience. 
