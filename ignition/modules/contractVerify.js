const express = require('express')
const { ethers } = require('hardhat')
const fs = require('fs')
const solc = require('solc');
const parser = require('solidity-parser-antlr');
const hre = require('hardhat');
const ContractVerify = require('../../models/verfiedContract.model')

const app = express()
app.use(express.json())

const contractVerify=async(req,res)=>{
  try {
    const { sourceCode, contractAddress, compilerVersion, licenseType } = req.body;

    const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
    fs.writeFileSync(`./contracts/${filename}`, sourceCode);

    // Compile the contract
    await hre.run('compile');

    let contractName = null;
    const ast = parser.parse(sourceCode, { tolerant: true });
    parser.visit(ast, {
      ContractDefinition(node) {
        if (!contractName) {
          contractName = node.name;
        }
      }
    });

    if (!contractName) {
      throw new Error("Unable to find contract name in the source code");
    }

    const input = {
      language: 'Solidity',
      sources: {
        [filename]: {
          content: sourceCode
        }
      },
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode']
          }
        }
      }
    };

    const compiled = JSON.parse(solc.compile(JSON.stringify(input), { version: compilerVersion }));
    console.log("compiled>>>>>>>",compiled);
    

    let contractData = null; 

 
    for (const [filename, contracts] of Object.entries(compiled.contracts)) {
      console.log("Filename:", filename);
      
      for (const [contractName, contractObj] of Object.entries(contracts)) {
        console.log("Contract Name:", contractName);
        console.log("Contract Object:", contractObj);
        
        // Access specific contract data
        contractData = compiled.contracts[filename][contractName];
        console.log("Contract Data:", contractData);
      }
    }

    const compiledContract = await ethers.getContractFactory(contractName)
    // console.log("compiledContract...................",compiledContract.bytecode);
    
    const deployedBytecode = await compiledContract.getDeployTransaction(contractAddress)
    // console.log("deployedBytecode...............",deployedBytecode);
    
    const byecodeThroughContractAddress = deployedBytecode.data.slice(0, -64);
    // console.log("byecodeThroughContractAddress........",byecodeThroughContractAddress);
    




    if (byecodeThroughContractAddress === compiledContract.bytecode) {
      console.log("inside if ...........................");
      
      const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/w__cxcI_OHV4AVU_zQytZFuicqthKg8v');
      const contractBytecode = await provider.getCode(contractAddress);

                  const newContractVerify= new ContractVerify({
                contractAddress:contractAddress,
                contractBytecode:contractBytecode,
                abi:JSON.stringify(contractData.abi),
                object:contractData.evm.bytecode.object,
                opCodes:contractData.evm.bytecode.opcodes,
                sourceMap:contractData.evm.bytecode.sourceMap

            })
      console.log("Contract bytecode matches expected bytecode");



      console.log("Contract bytecode matches expected bytecode");
            

                  const contractVerify=await newContractVerify.save()
                  res.status(200).json({sucess:true, contractVerify, message: 'Contract bytecode matches expected bytecode' });
      
      // res.json({ contractBytecode, contractData, message: 'Contract bytecode matches expected bytecode' });
    } else {
      res.json({ message: 'Contract bytecode does not match expected bytecode' });
    }

    // fs.unlinkSync(`./contracts/${filename}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports={
  contractVerify:contractVerify
}






















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
    
//     const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/w__cxcI_OHV4AVU_zQytZFuicqthKg8v');
//     const deployedBytecodecnt = await provider.getCode(contractAddress)
//     // const deployedBytecode= await contractData.getDeployTransaction(contractAddress)

// console.log("deployedBytecodecnt>>>>>>>>>>>",deployedBytecodecnt);


//     const bytecodeHash = (creationCode);
//     console.log("bytecodeHash...............",bytecodeHash);
    
//     const deployedBytecodeHash = (deployedBytecode);
//     console.log("deployedBytecodeHash............",deployedBytecodeHash);
    

//     if (bytecodeHash.equals(deployedBytecodeHash)) {
//       console.log("Bytecode matches");
//       // Create a new contract verification object
//       const newContractVerify = new ContractVerify({
//         contractAddress: contractAddress,
//         contractBytecode: deployedBytecode,
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

//     // const compiled = JSON.parse(solc.compile(JSON.stringify(input), { version: compilerVersion, licenseType }));

//     // const contractNames = Object.keys(compiled.contracts[filename]);
//     getContractNamesFromSourceCode(sourceCode)
//     const contractData = {};

//     for (const contractName of contractNames) {
//       contractData[contractName] = compiled.contracts[filename][contractName];
//     }

//     if (Object.keys(contractData).length === 0) {
//       throw new Error("Unable to find contract data");
//     }

//     for (const contractName in contractData) {
//       const abi = contractData[contractName].abi;
//       const bytecode = contractData[contractName].evm.bytecode.object;
//       console.log("bytecode>>>>>>>>>>>>",bytecode);
      

//       const contractFactory = new ethers.ContractFactory(abi, bytecode);
//       const deployedBytecode = await contractFactory.getDeployTransaction(contractAddress);


//       console.log("deployedBytecode>>>>>>>>>>>>",deployedBytecode.data.slice(2,-64));
      

//       if (bytecode === deployedBytecode.data.slice()) {
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


















