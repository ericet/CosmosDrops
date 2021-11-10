
const checkDesmos = (address) => {
    return new Promise((resolve) => {
        axios.get(`https://api.airdrop.desmos.network/users/${address}`).then(res => {
            console.log(res);
            resolve(res.data);
        }).catch(err => {
            console.log(err);
        })
    });
}

const checkGame = (address) => {
    return new Promise((resolve) => {
        let data = `{\"operationName\":\"GET_AIRDROP\",\"variables\":{\"acc_address\":\"${address}\"},\"query\":\"query GET_AIRDROP($acc_address: String!) {\\n  airdrop(acc_address: $acc_address) {\\n    denom\\n    amount\\n    __typename\\n  }\\n}\\n\"}`;

        axios.request({
            url: `https://anyplace-cors.herokuapp.com/https://airdrop.gamenet.one/query`,
            method: 'post',
            data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            },
        }).then(res => {
            resolve(res.data.data.airdrop);
        }).catch(err => {
            console.log(err);
        })
    });
}

const checkStar = (address) => {
    return new Promise((resolve) => {
        axios.get(`https://anyplace-cors.herokuapp.com/https://airdrop.devnet.publicawesome.dev/address/${address}`).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err)
        })
    });
}
function checkSunny(address) {
    return new Promise((resolve) => {
        axios.get(`https://osmosis-airdrop-artifacts.sunny.ag/proofs/${address.replace('cosmos', 'osmo')}.json`).then(res => {
            resolve(res.data);
        }).catch(err => {
            resolve(null);
        })
    });
}

const checkComdex = (address) => {
    return new Promise((resolve) => {
        axios.post(`https://anyplace-cors.herokuapp.com/https://airdrop.comdex.one/getCosmosAccountRoute`, { "address": `${address}` }).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err);
        })
    });
}

const checkJuno = (address) => {
    return new Promise((resolve) => {
        axios.get(`https://anyplace-cors.herokuapp.com/https://stakedrop-api.junochain.com/address/${address}`).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err);
        })
    });
}

const checkPstake = (address) => {
    return new Promise((resolve) => {
        axios.get(`https://cosmos.airdrop.pstake.finance/cosmos/${address}`).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err);
        })
    });
}

$(document).ready(async function () {
    $('#findButton').submit(async function (e) {
        e.preventDefault();
        let address = $('#address').val().trim();
        Promise.all([checkDesmos(address), checkGame(address), checkStar(address), checkComdex(address), checkJuno(address), checkPstake(address)]).then(([desmos, game, star, comdex, juno, pstake]) => {
            $('#desmos').html(`The allocated $DSM amount is <br/><h3>${desmos.dsm_allotted} DSM</h3>`);
            $('#game').html(`The allocated $GAME amount is <br/><h3>${game.amount / 10e5} GAME</h3>`);
            $('#stargaze').html(`The allocated $STAR amount is <br/><h3>${star.balance} STAR</h3>`);
            $('#comdex').html(`The allocated $CMDX amount is <br/><h3>${comdex.length > 0 ? comdex[0].drop : 0} CMDX</h3>`);
            $('#juno').html(`The allocated $JUNO amount is <br/><h3>${juno.balance} JUNO</h3>`);
            $('#pstake').html(`The allocated $PSTAKE amount is <br/><h3>${pstake.success == false ? 0 : Number(pstake.result.airdrop.tokenHoldersAndStakersDrop) + Number(pstake.result.airdrop.stakeDropAuditStakersDrop) + Number(pstake.result.airdrop.stakeDropStakersDrop)} PSTAKE</h3>`);
        })
    });
});