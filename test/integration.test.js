const Token = artifacts.require('./Token.sol');

contract('Token (integration)', function(accounts) {
  let contract;
  let owner;
  let web3Contract;

  before(async () => {
    contract = await Token.deployed();
    web3Contract = web3.eth.contract(contract.abi).at(contract.address);
    owner = web3Contract._eth.coinbase;
  });

  it('should pass if contract is deployed', async function() {
    let name = await contract.name.call();
    assert.strictEqual(name, 'Token');
  });

  it('should return inital token wei balance of 1*10^27', async function() {
    let ownerBalance = await contract.balanceOf.call(owner);
    ownerBalance = ownerBalance.toString();
    assert.strictEqual(ownerBalance, '1e+27');
  });

  it('should properly [transfer] token', async function() {
    let recipient = web3.eth.accounts[1];
    let tokenWei = 1000000;

    await contract.transfer(recipient, tokenWei);
    
    let ownerBalance = await contract.balanceOf.call(owner);
    let recipientBalance = await contract.balanceOf.call(recipient);

    assert.strictEqual(ownerBalance.toString(), '9.99999999999999999999e+26');
    assert.strictEqual(recipientBalance.toNumber(), tokenWei);
  });

  it('should properly return the [totalSupply] of tokens', async function() {
    let totalSupply = await contract.totalSupply.call();
    totalSupply = totalSupply.toString();
    assert.strictEqual(totalSupply, '1e+27');
  });

  it('should [approve] token for [transferFrom]', async function() {
    let approver = owner;
    let spender = web3.eth.accounts[2];

    let originalAllowance = await contract.allowance.call(approver, spender);

    let tokenWei = 5000000;
    await contract.approve(spender, tokenWei);

    let resultAllowance = await contract.allowance.call(approver, spender);

    assert.strictEqual(originalAllowance.toNumber(), 0);
    assert.strictEqual(resultAllowance.toNumber(), tokenWei);
  });

});
