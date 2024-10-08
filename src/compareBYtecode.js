
const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
const hardhat = require('hardhat');

const web3 = new Web3('https://gtc-dataseed.gtcscan.io/');

const contractVerify=async(req,res)=>{
  const { contractAddress, compilerVersion, licenseType, sourceCode } = req.body;

  try {
        const onChainBytecode = await getOnChainBytecode(contractAddress);
        console.log("onChainBytecode......",onChainBytecode.length);
        

        const localBytecode = await compileSourceCodeWithHardhat(sourceCode, compilerVersion);
        
        console.log("localBytecode length ........",localBytecode.length);
        
    
        const onChainBytecodeNoMeta = removeMetadata(onChainBytecode);
        console.log("onChainBytecodeNoMeta....",onChainBytecodeNoMeta.length);
        
        const localBytecodeNoMeta = removeMetadata(localBytecode);
        console.log("localBytecodeNoMeta",localBytecodeNoMeta.length);
        
    
        if (onChainBytecodeNoMeta === localBytecodeNoMeta) {
          console.log('Bytecodes match exactly when ignoring metadata!');
      } else {
          console.log('Bytecodes do not match. Analyzing differences...');
          const firstDiff = findFirstDifference(onChainBytecodeNoMeta, localBytecodeNoMeta);
          console.log('First differing position:', firstDiff);
          console.log('On-chain bytecode around differing position:', onChainBytecodeNoMeta.slice(firstDiff - 10, firstDiff + 10));
          console.log('Local bytecode around differing position:', localBytecodeNoMeta.slice(firstDiff - 10, firstDiff + 10));
      }
    
        res.json({
          contractAddress,
          compilerVersion,
          licenseType,
          sourceCode,
          onChainBytecode,
          localBytecode,
          bytecodeMatch,
        });
  } catch (error) {
    
  }
}



function findFirstDifference(str1, str2) {
  const minLength = Math.min(str1.length, str2.length);
  for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) {
          return i;
      }
  }
  return minLength;
}
async function getOnChainBytecode(contractAddress) {
  try {
    const bytecode = await web3.eth.getCode(contractAddress);
    console.log("getOnChainBytecode >>>>>>>>>>>>>>>",bytecode.length)
    return bytecode;
  } catch (error) {
    console.error('Error fetching on-chain bytecode:', error);
    return null;
  }
}




async function compileSourceCodeWithHardhat(sourceCode, compilerVersion) {
  try {
    const filename = `contract_${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.sol`;
    const contractPath = `./contracts/${filename}`;
    const cleanContractPath = contractPath.replace(/^\./, ''); 

    console.log("contractPath...", contractPath);

    try {
      fs.writeFileSync(contractPath, sourceCode);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error writing source code to file' });
    }
    const compile = await hardhat.run('compile', {
      sources: [contractPath],
      settings: {
        // optimizer: {
        //   enabled: true,
        //   runs: 200,
        // },
        version: compilerVersion,
      },
    });

    const artifactPath = path.join(__dirname, `../artifacts/${cleanContractPath}/APS.json`);
    

    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

    
    

    const localBytecode = artifact.deployedBytecode || artifact.bytecode;
    // fs.unlinkSync(tempFile);

    return localBytecode;
  } catch (error) {
    console.error('Error compiling source code:', error);
    return null;
  }
}



function removeMetadata(bytecode) {
  const metadataStart = bytecode.indexOf('a264'); 
  console.log("metadataStart.......",metadataStart)
  return metadataStart !== -1 ? bytecode.slice(0, metadataStart) : bytecode;
}

module.exports={contractVerify:contractVerify}









