// Create a pair contract: Weth/Sushi coin
// MidPrice of Weth to Sushi coin, and MidPrice of Sushi coin to Weth
require("dotenv").config()
const { Token, ChainId, Pair, CurrencyAmount, Route } = require('@sushiswap/sdk');
const ethers = require('ethers')
const uniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const sushiAddress = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2";

const tokenA = new Token(ChainId.MAINNET, wethAddress, 18, "WETH", "Wrapped Ether");
const tokenB = new Token(ChainId.MAINNET, sushiAddress, 18, "Sushi", "Sushi Coin");
const pairAddress = Pair.getAddress(tokenA, tokenB);

const provider = new ethers.providers.JsonRpcProvider(process.env.HTTP_URL);

const uniV2PairContract = new ethers.Contract(pairAddress, uniswapV2Pair.abi, provider);

const sushiTest = async() => {
    const reserves = await uniV2PairContract.getReserves()

    const token0Address = await uniV2PairContract.token0()
    const token1Address = await uniV2PairContract.token1()
    const token0 = [tokenA, tokenB].find(token => token.address === token0Address)
    const token1 = [tokenA, tokenB].find(token => token.address === token1Address)

    const pair = new Pair(
        CurrencyAmount.fromRawAmount(token0, reserves.reserve0.toString()),
        CurrencyAmount.fromRawAmount(token1, reserves.reserve1.toString())
    )
    
    const route = new Route([pair], tokenA, tokenB)
    console.log(`1 Weth can be swapped for ${route.midPrice.toSignificant(6)} Sushi coin`);
    console.log(`1 Sushi can be swapped for ${route.midPrice.invert().toSignificant(6)} Weth`);

}
sushiTest();
