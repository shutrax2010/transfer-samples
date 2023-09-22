
var isLoad = false;

function AddStringToTextarea( text ) {
//    console.log(text)

    var original = document.getElementById('console').value;
    document.getElementById('console').value = original + "\n" + text;

    var textarea = document.getElementById('console');
    textarea.scrollTop = textarea.scrollHeight;
}


const testNet = "https://testnet.xrpl.org/accounts/"

const user1 ={
    "name": "Ptah Onouphrios",
    "address": "rNwWqQKsVuFqFgPpFpnkdBfjCFiTdaNBjM",
    "secret": "sEdST4zxFABc43z3JcmyayXvhfVsmD7",
    "tagId": "user1"
}
const user2 ={
    "name": "Phaedra Simon",
    "address": "rHR1qJBWsKTAkCtEyEtFw2Ga7qS1NRBuH1",
    "secret": "sEdVRykPDUxVagL7sUdzAPSuiMvTrvn",
    "tagId": "user2"
}
const user3 ={
    "name": "Arachne Odysseus",
    "address": "ra43axu7VCECcTFKpemA9cnaya9ySpnRKB",
    "secret": "sEdVcdZWFi4GHV2P3zco3NBcaug1czh",
    "tagId": "user3"
}

const users =[user1, user2, user3]


// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}


// Connect ---------------------------------------------------------------------
async function updateUserInfo() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    AddStringToTextarea("Connecting to Testnet...")
    await client.connect()
    isLoad = true

    await getUserInfo(client, user1)
    await getUserInfo(client, user2)
    await getUserInfo(client, user3)

    client.disconnect()
    document.getElementById('loading').style.display = 'none'  
    isLoad = false
}

async function getUserInfo(client, user){
    var tagText = user.tagId
    var seed = user.secret

    const wallet = xrpl.Wallet.fromSeed(seed)

    const my_balance = (await client.getXrpBalance(wallet.address))  
    AddStringToTextarea("MY Address: " + my_balance)
    
    AddStringToTextarea("Address: " + wallet.address)
    AddStringToTextarea("Public Key: " +  wallet.publicKey)
    AddStringToTextarea("Private Key: " + wallet.privateKey)
    AddStringToTextarea("Balance: " +  (await client.getXrpBalance(wallet.address)))
    AddStringToTextarea("Seed: " +  wallet.seed)

    document.getElementById(tagText + '_name').innerText = user.name
    document.getElementById(tagText + '_tokens').innerText = my_balance

    var url = testNet + user.address + "/"
    document.getElementById(tagText + '_link').setAttribute('href', url)

    AddStringToTextarea("Completed getting user information: " + user.name)
}


async function sendXRP(user_src, user_dst, amount) {

    document.getElementById('loading').style.display = 'block'
    isLoad = true

    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    AddStringToTextarea("Connecting to Testnet...")
    await client.connect()

    src_seed = user_src.secret
    const wallet = xrpl.Wallet.fromSeed(src_seed)

    var src_addr = user_src.address;
    var dst_addr = user_dst.address

    const prepared = await client.autofill({
        "TransactionType": "Payment",
    //    "Account": wallet.address,
        "Account": src_addr,
        "Amount": xrpl.xrpToDrops(amount),
        "Destination": dst_addr
    })
    const max_ledger = prepared.LastLedgerSequence
    AddStringToTextarea("Prepared transaction instructions:", prepared)
    AddStringToTextarea("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
    AddStringToTextarea("Transaction expires after ledger:", max_ledger)


    const signed = wallet.sign(prepared)
    AddStringToTextarea("Identifying hash:", signed.hash)
    AddStringToTextarea("Signed blob:", signed.tx_blob)

    const tx = await client.submitAndWait(signed.tx_blob)

    AddStringToTextarea("Transaction result:", tx.result.meta.TransactionResult)
    AddStringToTextarea("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

    await getUserInfo(client, user_src)
    await getUserInfo(client, user_dst)

    client.disconnect()
    document.getElementById('loading').style.display = 'none'
    isLoad = false

} // End of main()

//import { AccountSetAsfFlags, Client, Wallet } from 'xrpl';


async function SendBTX(src_seed, dst_seed) {
/*
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  AddStringToTextarea("Connecting to Testnet...")
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  AddStringToTextarea("Requesting addresses from the Testnet faucet...")

  const issuerWallet = xrpl.Wallet.fromSeed(src_seed)
  const cold_wallet = xrpl.Wallet.fromSeed(dst_seed)

  await client.submitAndWait({
    TransactionType: 'AccountSet',
    Account: issuerWallet.address,
    SetFlag: AccountSetAsfFlags.asfDefaultRipple,
  }, { wallet: issuerWallet })

  const response = await client.request<AccountInfoRequest,AccountInfoResponse>({
  command: 'account_info',
  account: issuerWallet.address
})
const flag = response.result.account_data.Flags
console.log('DefaultRippled Flag: ' + ((flag & AccountRootFlags.lsfDefaultRipple) > 0))


AddStringToTextarea('DefaultRippled Flag: ' + ((flag & AccountRootFlags.lsfDefaultRipple) > 0))



await client.submitAndWait({
  TransactionType: 'TrustSet',
  Account: cold_wallet.address,
  LimitAmount: {
    issuer: issuerWallet.address,
    currency: 'BTX',
    value: '10000'
  }
},{ cold_wallet })


await client.submitAndWait({
  TransactionType: 'Payment',
  Account: issuerWallet.address,
  Destination: wallet.address,
  Amount: {
    issuer: issuerWallet.address,
    currency: 'BTX',
    value: '5000'
  }
}, { cold_wallet: issuerWallet })


const response2 = await client.request<AccountLinesRequest, AccountLinesResponse>({
  command: 'account_lines',
  account: issuerWallet.address,
})
const lines = response2.result.lines
console.log(lines)
AddStringToTextarea(lines)


  client.disconnect()
  document.getElementById('loading').style.display = 'none'  
*/
}


async function SendBTXTemp(src_seed, dst_seed) {

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
AddStringToTextarea("Connecting to Testnet...")
await client.connect()

// Get credentials from the Testnet Faucet -----------------------------------
AddStringToTextarea("Requesting addresses from the Testnet faucet...")

const hot_wallet = xrpl.Wallet.fromSeed(src_seed)
const cold_wallet = xrpl.Wallet.fromSeed(dst_seed)
AddStringToTextarea(`Got hot address ${hot_wallet.address} and cold address ${cold_wallet.address}.`)

// Configure issuer (cold address) settings ----------------------------------
const cold_settings_tx = {
  "TransactionType": "AccountSet",
  "Account": cold_wallet.address,
  "TransferRate": 0,
  "TickSize": 5,
  "Domain": "6578616D706C652E636F6D", // "example.com"
  "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
  // Using tf flags, we can enable more flags in one transaction
  "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
           xrpl.AccountSetTfFlags.tfRequireDestTag)
}

const cst_prepared = await client.autofill(cold_settings_tx)
const cst_signed = cold_wallet.sign(cst_prepared)

AddStringToTextarea("\nSending cold address AccountSet transaction...")


const cst_result = await client.submitAndWait(cst_signed.tx_blob)
if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {

  var url = `https://testnet.xrpl.org/transactions/${cst_signed.hash}`
  var mess = `Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.hash}`
  AddStringToTextarea(mess)

} else {
  throw `Error sending transaction: ${cst_result}`
}


// Configure hot address settings --------------------------------------------

const hot_settings_tx = {
  "TransactionType": "AccountSet",
  "Account": hot_wallet.address,
  "Domain": "6578616D706C652E636F6D", // "example.com"
  // enable Require Auth so we can't use trust lines that users
  // make to the hot address, even by accident:
  "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
  "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
            xrpl.AccountSetTfFlags.tfRequireDestTag)
}

const hst_prepared = await client.autofill(hot_settings_tx)
const hst_signed = hot_wallet.sign(hst_prepared)
AddStringToTextarea("Sending hot address AccountSet transaction...")
const hst_result = await client.submitAndWait(hst_signed.tx_blob)
if (hst_result.result.meta.TransactionResult == "tesSUCCESS") {

  var url = `https://testnet.xrpl.org/transactions/${hst_signed.hash}`
  var mess = `Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.hash}`
  AddStringToTextarea(mess)

} else {
  throw `Error sending transaction: ${hst_result.result.meta.TransactionResult}`
}


// Create trust line from hot to cold address --------------------------------
const currency_code = "FOO"
const trust_set_tx = {
  "TransactionType": "TrustSet",
  "Account": hot_wallet.address,
  "LimitAmount": {
    "currency": currency_code,
    "issuer": cold_wallet.address,
    "value": "10000000000" // Large limit, arbitrarily chosen
  }
}

const ts_prepared = await client.autofill(trust_set_tx)
const ts_signed = hot_wallet.sign(ts_prepared)
AddStringToTextarea("Creating trust line from hot address to issuer...")
const ts_result = await client.submitAndWait(ts_signed.tx_blob)
if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {

  var url = `https://testnet.xrpl.org/transactions/${ts_signed.hash}`
  var mess = 'Transaction succeeded: ' + url
  AddStringToTextarea(mess)

} else {
  throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
}


// Send token ----------------------------------------------------------------
const issue_quantity = "3840"
const send_token_tx = {
  "TransactionType": "Payment",
  "Account": cold_wallet.address,
  "Amount": {
    "currency": currency_code,
    "value": issue_quantity,
    "issuer": cold_wallet.address
  },
  "Destination": hot_wallet.address,
  "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                      // on the hot account earlier.
}

const pay_prepared = await client.autofill(send_token_tx)
const pay_signed = cold_wallet.sign(pay_prepared)


  var mess2 = `Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`
  AddStringToTextarea(mess2)

const pay_result = await client.submitAndWait(pay_signed.tx_blob)
if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {

  var url = `https://testnet.xrpl.org/transactions/${pay_signed.hash}`
  var mess = 'Transaction succeeded: ' + url
  AddStringToTextarea(mess)

} else {
  throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
}

// Check balances ------------------------------------------------------------
AddStringToTextarea("\nGetting hot address balances...")
const hot_balances = await client.request({
  command: "account_lines",
  account: hot_wallet.address,
  ledger_index: "validated"
})


var res1 = JSON.stringify(hot_balances.result, null, 2);
AddStringToTextarea(res1)

AddStringToTextarea("Getting cold address balances...")
const cold_balances = await client.request({
  command: "gateway_balances",
  account: cold_wallet.address,
  ledger_index: "validated",
  hotwallet: [hot_wallet.address]
})


var res2 = JSON.stringify(cold_balances.result, null, 2);
AddStringToTextarea(res2)

client.disconnect()
document.getElementById('loading').style.display = 'none'  

} // End of tempBTX()



const isNum = n => typeof n === "string" && n !== "" &&  !isNaN( n );



function buttonClick(){
    if(isLoad){
        return ;
    }

    var amount = document.getElementById('amount').value;

    var toSel = document.getElementById('to');
    var toIndex = toSel.selectedIndex;
    var frSel = document.getElementById('from');
    var frIndex = frSel.selectedIndex;

    AddStringToTextarea("\nSending...\n"+users[frIndex].name + " -> " + users[toIndex].name + " : " + amount)

    if(frIndex === toIndex || !isNum(amount) || amount <= 0){
        AddStringToTextarea("Error")
        return  ;
    }

    sendXRP(users[frIndex], users[toIndex], amount)

}


updateUserInfo();

