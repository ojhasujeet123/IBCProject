























// const express = require('express')
// const { ethers } = require('hardhat')
// const fs = require('fs')
// const solc = require('solc');
// const parser = require('solidity-parser-antlr');
// const hre = require('hardhat');
// const ContractVerify = require('../../models/verfiedContract.model')

// const app = express()
// app.use(express.json())

// const contractVerify=async(req,res)=>{
//   try {
//     const { sourceCode, contractAddress, compilerVersion, licenseType } = req.body;

//     const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
//     fs.writeFileSync(`./contracts/${filename}`, sourceCode);

//     // Compile the contract
//     await hre.run('compile');

//     let contractName = null;
//     const ast = parser.parse(sourceCode, { tolerant: true });
//     parser.visit(ast, {
//       ContractDefinition(node) {
//         if (!contractName) {
//           contractName = node.name;
//         }
//       }
//     });

//     if (!contractName) {
//       throw new Error("Unable to find contract name in the source code");
//     }

//     const input = {
//       language: 'Solidity',
//       sources: {
//         [filename]: {
//           content: sourceCode
//         }
//       },
//       settings: {
//         optimizer: {
//           enabled: true,
//           runs: 200
//         },
//         outputSelection: {
//           '*': {
//             '*': ['abi', 'evm.bytecode']
//           }
//         }
//       }
//     };

//     const compiled = JSON.parse(solc.compile(JSON.stringify(input), { version: compilerVersion }));
//     console.log("compiled>>>>>>>",compiled);


//     let contractData = null; 


//     for (const [filename, contracts] of Object.entries(compiled.contracts)) {
//       console.log("Filename:", filename);

//       for (const [contractName, contractObj] of Object.entries(contracts)) {
//         console.log("Contract Name:", contractName);
//         console.log("Contract Object:", contractObj);

//         // Access specific contract data
//         contractData = compiled.contracts[filename][contractName];
//         console.log("Contract Data:", contractData);
//       }
//     }

//     const compiledContract = await ethers.getContractFactory(contractName)
//     // console.log("compiledContract...................",compiledContract.bytecode);

//     const deployedBytecode = await compiledContract.getDeployTransaction(contractAddress)
//     // console.log("deployedBytecode...............",deployedBytecode);

//     const byecodeThroughContractAddress = deployedBytecode.data.slice(0, -64);
//     // console.log("byecodeThroughContractAddress........",byecodeThroughContractAddress);





//     if (byecodeThroughContractAddress === compiledContract.bytecode) {
//       console.log("inside if ...........................");

//       const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/w__cxcI_OHV4AVU_zQytZFuicqthKg8v');
//       const contractBytecode = await provider.getCode(contractAddress);

//                   const newContractVerify= new ContractVerify({
//                 contractAddress:contractAddress,
//                 contractBytecode:contractBytecode,
//                 abi:JSON.stringify(contractData.abi),
//                 object:contractData.evm.bytecode.object,
//                 opCodes:contractData.evm.bytecode.opcodes,
//                 sourceMap:contractData.evm.bytecode.sourceMap

//             })
//       console.log("Contract bytecode matches expected bytecode");



//       console.log("Contract bytecode matches expected bytecode");


//                   const contractVerify=await newContractVerify.save()
//                   res.status(200).json({sucess:true, contractVerify, message: 'Contract bytecode matches expected bytecode' });

//       // res.json({ contractBytecode, contractData, message: 'Contract bytecode matches expected bytecode' });
//     } else {
//       res.json({ message: 'Contract bytecode does not match expected bytecode' });
//     }

//     // fs.unlinkSync(`./contracts/${filename}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




// module.exports={
//   contractVerify:contractVerify
// }






















// const {ethers}= require('hardhat')
// const fs = require('fs')
// const solc = require('solc')
// const parser = require('solidity-parser-antlr')
// const hre = require('hardhat')
// const ContractVerify = require('../../models/verfiedContract.model')

// const contractVerify=async(req,res)=>{
//     try {

//         const {sourceCode , contractAddress , compilerverson , licenseType}=req.body;
//         const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
//         fs.writeFileSync(`./contracts/${filename}`, sourceCode);

//         await hre.run('compile')

//         let contractName = null;
//         const ast = parser.parse(sourceCode,{tolerant:true});
//         parser.visit(ast,{
//             ContractDefinition(node){
//                 if(!contractName)
//                     contractName=node.name;
//             }
//         });

//         if(!contractName){
//             throw new Error("Unable to find contract name in the source code");
//         }


//         const input = {
//             language:'Solidity',
//             sources:{
//                 [filename]:{
//                     content:sourceCode
//                 }
//             },
//             settings :{
//                 optimizer:{
//                     enabled:true,
//                     runs:200
//                 },
//                 outputSelection : {
//                     '*' : {
//                         '*':['abi','evm.bytecode']
//                     }

//                 }
//             }
//         };


//         const compiled = JSON.parse(solc.compile(JSON.stringify(input),{version:compilerverson},{licenseType:licenseType}))

//         let contractData = null;




//         for (const [filename, contracts] of Object.entries(compiled.contracts)) {
//             console.log("Filename:", filename);

//             for (const [contractName, contractObj] of Object.entries(contracts)) {
//               console.log("Contract Name:", contractName);
//               console.log("Contract Object:", contractObj);

//               // Access specific contract data
//               contractData = compiled.contracts[filename][contractName]; // Assign contractData here
//               console.log("Contract Data:", contractData);
//             }
//           }


//         const compiledContract = await ethers.getContractFactory(contractName)
//         console.log("compiledContract.......",compiledContract);

//         const deployedBytecode = await compiledContract.getDeployTransaction(contractAddress)
//         const byecodeThroughContractAddress = deployedBytecode.data.slice(0, -64);
//         console.log("byecodeThroughContractAddress.............",byecodeThroughContractAddress);


//         if (byecodeThroughContractAddress === compiledContract.bytecode) {
//             console.log("inside if ...........................");

//             const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/w__cxcI_OHV4AVU_zQytZFuicqthKg8v');
//             const contractBytecode = await provider.getCode(contractAddress);
//             console.log("contractData...........",contractData);

//             const newContractVerify= new ContractVerify({
//                 contractAddress:contractAddress,
//                 contractBytecode:contractBytecode,
//                 abi:JSON.stringify(contractData.abi),
//                 object:contractData.evm.bytecode.object,
//                 opCodes:contractData.evm.bytecode.opcodes,
//                 sourceMap:contractData.evm.bytecode.sourceMap

//             })
//             console.log("Contract bytecode matches expected bytecode");


//             const contractVerify=await newContractVerify.save()
//             res.status(200).json({sucess:true, contractVerify, message: 'Contract bytecode matches expected bytecode' });
//           } else {
//             res.json({ message: 'Contract bytecode does not match expected bytecode' });
//           }



//     } catch (error) {
//         console.error(error);
//         res.status(500).json({success:false , message:"Internal server error"})

//     }
// }


// module.exports={
//     contractVerify:contractVerify
// }













































// last

// const { ethers } = require('hardhat');
// const fs = require('fs');
// const hre = require('hardhat');
// const ContractVerify = require('../../models/verfiedContract.model');

// const contractVerify = async (req, res) => {
//   try {
//     const { sourceCode, contractAddress, compilerVersion, licenseType } = req.body;
//     const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
//     fs.writeFileSync(`./contracts/${filename}`, sourceCode);

//     hre.config.solidity.compilers.push({
//       version: compilerVersion,
//       settings: {
//         optimizer: {
//           enabled: true,
//           runs: 200,
//         },
//         evmVersion: 'paris',
//       },
//     });

//     await hre.run('compile');

//     const contractNames = getContractNamesFromSourceCode(sourceCode);

//     let contractData = null;
//     const contractBytecodes = {};
//     for (const contractName of contractNames) {
//       contractData = await hre.artifacts.readArtifact(contractName);
//       if (!contractData) {
//         throw new Error(`Unable to find contract data for ${contractName}`);
//       }
//       contractBytecodes[contractName] = contractData.bytecode;
//     }



//     const abi = contractData.abi;
//     const creationCode = contractData.bytecode;
//     const deplyedbt=contractData.deployedBytecode


//     console.log("contract data>>>>>>>>>>",contractData);

//     const provider = new ethers.JsonRpcProvider('https://glc-dataseed.glcscan.io/');
//     const deployedBytecodecnt = await provider.getCode(contractAddress)
//     const deployedBytecode= await contractData.getDeployTransaction()

// console.log("deplyedbt.............",deplyedbt)
// console.log("deployedBytecodecnt...............",deployedBytecodecnt)
// console.log("deployedBytecode...........",deployedBytecode);





//     if (deplyedbt.equals(deployedBytecodecnt)) {
//       console.log("Bytecode matches");
//       // Create a new contract verification object
//       const newContractVerify = new ContractVerify({
//         contractAddress: contractAddress,
//         contractBytecode: deployedBytecodecnt,
//         abi: JSON.stringify(abi),
//         creationCode: creationCode,
//         constructorArgs: contractData,
//         sourceMap: contractData,
//         swarmSource: uploadedSourceCode,
//       });

//       // Save the contract verification object to the database
//       const contractVerify = await newContractVerify.save();
//       res.status(200).json({ success: true, contractVerify, message: 'Contract bytecode matches expected bytecode' });
//     } else {
//       console.log("Bytecode does not match");
//       res.status(400).json({ success: false, message: 'Contract bytecode does not match expected bytecode' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// function getContractNamesFromSourceCode(sourceCode) {
//   const contractNameRegex = /contract\s+(\w+)/g;
//   const match = sourceCode.match(contractNameRegex);
//   if (match) {
//     return match.map((m) => m.replace('contract ', ''));
//   } else {
//     throw new Error("Unable to find contract names in source code");
//   }
// }

// module.exports = {
//   contractVerify: contractVerify,
// };













// //WORK FOR SINGLE CONTRACT

// const { ethers } = require('ethers');
// const fs = require('fs');
// const solc = require('solc');
// const hre = require('hardhat');
// const ContractVerify = require('../../models/verfiedContract.model');

// const contractVerify = async (req, res) => {
//   try {
//     const { sourceCode, contractAddress, compilerVersion, licenseType } = req.body;
//     const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
//     fs.writeFileSync(`./contracts/${filename}`, sourceCode);

//     const input = {
//       language: 'Solidity',
//       sources: {
//         [filename]: {
//           content: sourceCode,
//         },
//       },
//       settings: {
//         optimizer: {
//           enabled: true,
//           runs: 200,
//         },
//         outputSelection: {
//           '*': {
//             '*': ['abi', 'evm.bytecode'],
//           },
//         },
//       },
//     };
//     await hre.run('compile');

//     const compiled = JSON.parse(solc.compile(JSON.stringify(input), { version: compilerVersion, licenseType }));

//     const contractNames = Object.keys(compiled.contracts[filename]);
//     getContractNamesFromSourceCode(sourceCode)
//     const contractData = {};

//     for (const contractName of contractNames) {
//       console.log("contractName............",contractName);

//       contractData[contractName] = compiled.contracts[filename][contractName];

//     }

//     if (Object.keys(contractData).length === 0) {
//       throw new Error("Unable to find contract data");
//     }

//       // console.log("contract data",contractData);

//     for (const contractName in contractData) {
//       const abi = contractData[contractName].abi;
//       console.log("abi..........",abi);

//       const bytecode = contractData[contractName].evm.bytecode.object;
//       console.log("bytecode>>>>>>>>>>>>",bytecode);


//       const contractFactory = new ethers.ContractFactory(abi, bytecode);
//       const deployedBytecode = await contractFactory.getDeployTransaction();


//       console.log("deployedBytecode>>>>>>>>>>>>",deployedBytecode);


//       if (bytecode === deployedBytecode.data.slice(2,-64)) {
//         console.log("Bytecode matches");
//         // Create a new contract verification object
//         const newContractVerify = new ContractVerify({
//           contractAddress: contractAddress,
//           contractBytecode: bytecode,
//           abi: JSON.stringify(abi),
//           creationCode: bytecode,
//           constructorArgs: contractData[contractName],
//           sourceMap: contractData[contractName].evm.bytecode.sourceMap,
//           swarmSource: uploadedSourceCode,
//         });

//         // Save the contract verification object to the database
//         const contractVerify = await newContractVerify.save();
//         res.status(200).json({ success: true, contractVerify, message: 'Contract bytecode matches expected bytecode' });
//       } else {
//         console.log("Bytecode does not match");
//         res.status(400).json({ success: false, message: 'Contract bytecode does not match expected bytecode' });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// module.exports = {
//   contractVerify: contractVerify,
// };





// const { ethers } = require('ethers');
// const fs = require('fs');
// const solc = require('solc');
// const ContractVerify = require('../../models/verfiedContract.model');
// const abiCoder = new ethers.AbiCoder();

// const contractVerify = async (req, res) => {
//   try {
//     // Input validation
//     const { sourceCode, contractAddress, compilerVersion, licenseType } = req.body;
//     if (!sourceCode || !contractAddress || !compilerVersion || !licenseType) {
//       return res.status(400).json({ success: false, message: 'Invalid request body: Missing parameters' });
//     }

//     // Step 1: Write source code to a file
//     const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
//     const contractPath = `./contracts/${filename}`;

//     try {
//       fs.writeFileSync(contractPath, sourceCode);
//     } catch (error) {
//       return res.status(500).json({ success: false, message: 'Error writing source code to file' });
//     }

//     // Step 2: Prepare input for the Solidity compiler (solc)
//     const input = {
//       language: 'Solidity',
//       sources: {
//         [filename]: { content: sourceCode }
//       },
//       settings: {
//         optimizer: { enabled: true, runs: 200 },
//         outputSelection: { '*': { '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'] } }
//       }
//     };

//     // Step 3: Compile the contract using the specified compiler version
//     let compiled;
//     try {
//       compiled = JSON.parse(solc.compile(JSON.stringify(input)));
//     } catch (error) {
//       return res.status(500).json({ success: false, message: 'Compilation error', error: error.message });
//     }

//     // Step 4: Extract contract data from the compiled output
//     const contractNames = Object.keys(compiled.contracts[filename]);
//     if (!contractNames || contractNames.length === 0) {
//       return res.status(400).json({ success: false, message: 'No contracts found in compiled output' });
//     }

//     const provider = new ethers.JsonRpcProvider('https://glc-dataseed.glscan.io/');


//     // Step 5: Get contract creation transaction by scanning blocks
//     let creationTx = null;
//     const blockNumber = 932611; // Example block number
//     const block = await provider.getBlock(blockNumber);

//     for (const txHash of block.transactions) {
//       const tx = await provider.getTransaction(txHash);
//       const receipt = await provider.getTransactionReceipt(tx.hash);

//       if (receipt && receipt.contractAddress.toLocaleUpperCase() === req.body.contractAddress.toLocaleUpperCase()) {
//         creationTx = tx;
//         break;
//       }
//     }

//     if (!creationTx) {
//       return res.status(404).json({ success: false, message: 'Unable to find contract creation transaction' });
//     }

//     console.log(`Contract creation transaction found: ${creationTx.hash}`);

//     const deployedCode = await provider.getCode(contractAddress);
//     const constructorArgsEncoded = creationTx.data.replace(deployedCode, '');

//     for (const contractName of contractNames) {
//       console.log(`Verifying contract: ${contractName}`);

//       const contractInfo = compiled.contracts[filename][contractName];

//       // Check if bytecode is available, if not, skip this contract
//       if (!contractInfo.evm || !contractInfo.evm.bytecode || !contractInfo.evm.bytecode.object) {
//         console.log(`Skipping contract: ${contractName} as it does not have bytecode`);
//         continue; // Move to the next contract in the loop
//       }

//       const abi = contractInfo.abi;
//       const bytecode = contractInfo.evm.bytecode.object;

//       console.log(`ABI: ${abi}`);
//       console.log(`Bytecode: ${bytecode}`);

//       // Step 6: Decode constructor arguments
//       const contractFactory = new ethers.ContractFactory(abi, bytecode);
//       const constructorAbi = abi.find((item) => item.type === 'constructor');
//       const constructorInputs = constructorAbi ? constructorAbi.inputs : [];
//       console.log("constructorInputs.......",constructorInputs);
//       console.log("constructorArgsEncoded...............",constructorArgsEncoded);


//       // Decode constructor arguments only if there are any
//       let constructorArgsDecoded = [];
//       if (constructorInputs.length > 0 && constructorArgsEncoded) {


//         constructorArgsDecoded = abiCoder.decode(
//           constructorInputs.map(input => input.type),
//           '0x' + constructorArgsEncoded
//         );


//       }

//       // Get the deployment bytecode with the constructor arguments
//       const deployTransaction = contractFactory.getDeployTransaction(...constructorArgsDecoded);
//       const compiledDeployedBytecode = deployTransaction.data;

//       console.log(`Compiled deployed bytecode: ${compiledDeployedBytecode}`);

//       // Step 7: Compare the compiled deployed bytecode with the on-chain bytecode
//       if (deployedCode.startsWith(compiledDeployedBytecode)) {
//         console.log(`Bytecode matches for contract: ${contractName}`);

//         // Save contract verification data to the database
//         const newContractVerify = new ContractVerify({
//           contractAddress: contractAddress,
//           contractBytecode: bytecode,
//           abi: JSON.stringify(abi),
//           creationCode: bytecode,
//           constructorArgs: JSON.stringify(constructorArgsDecoded),
//           sourceMap: contractInfo.evm.bytecode.sourceMap,
//         });

//         await newContractVerify.save();
//         console.log(`Contract ${contractName} verified and saved.`);
//       } else {
//         console.log(`Bytecode mismatch for contract: ${contractName}`);
//         return res.status(400).json({ success: false, message: `Bytecode mismatch for contract: ${contractName}` });
//       }
//     }

//     // Step 8: Return success response after all contracts are verified
//     return res.status(200).json({ success: true, message: 'All contracts verified successfully' });
//   } catch (error) {
//     console.error('Error during contract verification:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//   }
// };

// module.exports = { contractVerify: contractVerify };












/*
sujeet ojha 17/09/2024
write a new code for contract verify but it not work well,
*/


// const { ethers } = require('ethers');
// const fs = require('fs');
// const solc = require('solc');
// const ContractVerify = require('../../models/verfiedContract.model');

// const contractVerify = async (req, res) => {
//   try {
//     // Input validation
//     const { sourceCode, contractAddress, compilerVersion, licenseType } = req.body;
//     if (!sourceCode || !contractAddress || !compilerVersion || !licenseType) {
//       return res.status(400).json({ success: false, message: 'Invalid request body: Missing parameters' });
//     }

//     // Write source code to a file
//     const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
//     const contractPath = `./contracts/${filename}`;

//     try {
//       fs.writeFileSync(contractPath, sourceCode);
//     } catch (error) {
//       return res.status(500).json({ success: false, message: 'Error writing source code to file' });
//     }

//     // Prepare input for the Solidity compiler (solc)
//     const input = {
//       language: 'Solidity',
//       sources: {
//         [filename]: { content: sourceCode }
//       },
//       settings: {
//         optimizer: { enabled: true, runs: 200 },
//         outputSelection: { '*': { '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'] } }
//       }
//     };

//     // Compile the contract using the specified compiler version
//     let compiled;
//     try {
//       compiled = JSON.parse(solc.compile(JSON.stringify(input)));
//     } catch (error) {
//       return res.status(500).json({ success: false, message: 'Compilation error', error: error.message });
//     }

//     // Extract contract data from the compiled output
//     const contractNames = Object.keys(compiled.contracts[filename]);
//     if (!contractNames || contractNames.length === 0) {
//       return res.status(400).json({ success: false, message: 'No contracts found in compiled output' });
//     }

//     const provider = new ethers.JsonRpcProvider('https://glc-dataseed.glscan.io/');

//     provider.getBlockNumber().then((blockNumber) => {
//       console.log('Current block number:', blockNumber);
//     }).catch((error) => {
//       console.error('Error connecting to the network:', error);
//     });
    
//     //  Get contract creation transaction by scanning blocks
//     let creationTx = null;
//     const blockNumber = 932611; 
//     const block = await provider.getBlock(blockNumber);

//     for (const txHash of block.transactions) {
//       const tx = await provider.getTransaction(txHash);
//       // console.log("tx----------->",await tx.wait());
      
//       const receipt = await provider.getTransactionReceipt(tx.hash);
//       // console.log("receipt........................",receipt);
      
//       if (receipt && receipt.contractAddress.toLocaleUpperCase() === req.body.contractAddress.toLocaleUpperCase()) {
//         creationTx = tx;
//         break;
//       }
//     }

//     if (!creationTx) {
//       return res.status(404).json({ success: false, message: 'Unable to find contract creation transaction' });
//     }

//     console.log(`Contract creation transaction found: ${creationTx.data}`);

//     // Extract the constructor arguments by removing the deployed bytecode
//     const deployedCode = await provider.getCode(contractAddress);
//     console.log("deployedCode........", deployedCode);

   



//     for (const contractName of contractNames) {
//       console.log(`Verifying contract: ${contractName}`);

//       const contractInfo = compiled.contracts[filename][contractName];

//       if (!contractInfo.evm || !contractInfo.evm.bytecode || !contractInfo.evm.bytecode.object) {
//         console.log(`Skipping contract: ${contractName} as it does not have bytecode`);
//         continue;
//       }

//       const abi = contractInfo.abi;
//       let bytecode = contractInfo.evm.bytecode.object;

//       // console.log(`ABI: ${abi}`);
//       console.log(`Bytecode: ${ethers.hexlify('0x'+bytecode)}`);

//       if (!ethers.isHexString(bytecode) && !ethers.isBytesLike(bytecode)) {
//         console.log("INSIDE IF ");
        
//         bytecode = ethers.hexlify('0X'+bytecode);
//         console.log("Converted bytecode to hex format:", bytecode);
//     } else {
//         console.log("Bytecode is already in hex format:", bytecode);
//     }
    
//       //  Decode constructor arguments using AbiCoder 
//       const abiCoder = new ethers.AbiCoder();  
//       const constructorAbi = abi.find((item) => item.type === 'constructor');
//       const constructorInputs = constructorAbi ? constructorAbi.inputs : [];
//       console.log("constructorInputs.......", constructorInputs);


//      let encodedConstructorArguments= calculateConstructorArgsLength(creationTx.data,constructorInputs)
//     //  console.log("encodedConstructorArguments",encodedConstructorArguments);
     
    
//       // Decode constructor arguments only if there are any
//       let constructorArgsDecoded = [];
//       if (constructorInputs.length > 0 && encodedConstructorArguments) {
//         constructorArgsDecoded = abiCoder.decode(
//           constructorInputs.map(input => input.type),
//           '0x'+encodedConstructorArguments
//         );
//       }

//       // console.log("constructorArgsDecoded.....", constructorArgsDecoded);

//       // Get the deployment bytecode with the constructor arguments
//       const contractFactory = new ethers.ContractFactory(abi, bytecode,provider);
//       console.log("contractFactory....", contractFactory);



//       const deployTransaction = await contractFactory.getDeployTransaction(...constructorArgsDecoded);
//       console.log("deployTransaction.....", deployTransaction);

//       const compiledDeployedBytecode = deployTransaction.data;
//       // const compiledDeployedBytecode = contractInfo.evm.bytecode.object;



//       console.log(`Compiled deployed bytecode: ${compiledDeployedBytecode}`);

//       //  Compare the compiled deployed bytecode with the on-chain bytecode
//       if (deployedCode.startsWith(compiledDeployedBytecode)) {
//         console.log(`Bytecode matches for contract: ${contractName}`);

//         // Save contract verification data to the database
//         const newContractVerify = new ContractVerify({
//           contractAddress: contractAddress,
//           contractBytecode: bytecode,
//           abi: JSON.stringify(abi),
//           creationCode: bytecode,
//           constructorArgs: JSON.stringify(constructorArgsDecoded),
//           sourceMap: contractInfo.evm.bytecode.sourceMap,
//         });

//         await newContractVerify.save();
//         console.log(`Contract ${contractName} verified and saved.`);
//       } else {
//         console.log(`Bytecode mismatch for contract: ${contractName}`);
//         return res.status(400).json({ success: false, message: `Bytecode mismatch for contract: ${contractName}` });
//       }
//     }

//     //  Return success response after all contracts are verified
//     return res.status(200).json({ success: true, message: 'All contracts verified successfully' });
//   } catch (error) {
//     console.error('Error during contract verification:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//   }
// };

// module.exports = {
//    contractVerify: contractVerify
// };





// function calculateConstructorArgsLength(creationTx,constructorInputs) {

//   let totalLength = 0;
//   constructorInputs.forEach((input) => {
//     if (input.type === 'uint256' || input.type === 'address' || input.type === 'bool') {
//       // Fixed-length types take 32 bytes (64 hex characters)
//       totalLength += 64;
//     } else if (input.type === 'string' || input.type === 'bytes') {
//       // Dynamic-length types (string, bytes) have a pointer first, so we need to resolve that
//       totalLength += 64;  // Pointer

//       // The pointer tells us where the actual data starts (in 32-byte chunks)
//       // We don't know the actual length, but we know it's a uint256 (32 bytes, 64 hex characters)
//       totalLength += 64;  // Length

//       // We don't know the actual data length, so we can't calculate the exact length
//       // However, we can assume a minimum length of 32 bytes (64 hex characters) for the data
//       totalLength += 64;  // Minimum data length
//     }
//   });

//   // return totalLength;
//   let encodedArgs=creationTx.slice(-totalLength)
//   return encodedArgs  

// }



