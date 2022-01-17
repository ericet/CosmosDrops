
const checkDesmos = (address) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.airdrop.desmos.network/users/${address}`).then(res => {
            console.log(res);
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    });
}
const checkLikecoin = (address) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://anyplace-cors.herokuapp.com/https://airdrop.like.co/api/overview?address=${address}`).then(res => {
            console.log(res);
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    });
}

const checkGame = (address) => {
    return new Promise((resolve, reject) => {
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
            reject(err);
        })
    });
}

const checkStar = (address) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://anyplace-cors.herokuapp.com/https://airdrop.devnet.publicawesome.dev/address/${address}`).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    });
}

const checkComdex = (address) => {
    return new Promise((resolve, reject) => {
        axios.post(`https://anyplace-cors.herokuapp.com/https://airdrop.comdex.one/getCosmosAccountRoute`, { "address": `${address}` }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    });
}

const checkJuno = (address) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://anyplace-cors.herokuapp.com/https://stakedrop-api.junochain.com/address/${address}`).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    });
}

const checkPstake = (address) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://cosmos.airdrop.pstake.finance/cosmos/${address}`).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    });
}

$(document).ready(async function () {
    $('#findButton').submit(async function (e) {
        e.preventDefault();
        let address = $('#address').val().trim();
        if (!address) {
            alert("Please Enter Cosmos Address!");
            $("#address").focus();
            return;
        }
        else if(!address.startsWith('cosmos')){
            alert("Invalid Cosmos Address!");
            $("#address").focus();
            return;
        }
        $('#spinner').html(`<div class="animationload">
        <div class="osahanloading"></div>
    </div>`);
        Promise.all([checkDesmos(address), checkGame(address), checkStar(address), checkJuno(address),checkLikecoin(address)]).then(([desmos, game, star, juno,likecoin]) => {
            $('#desmos').html(`The allocated $DSM amount is <br/><h3>${desmos.dsm_allotted.toFixed(2)} DSM</h3>`);
            $('#game').html(`The allocated $GAME amount is <br/><h3>${(game.amount / 10e5).toFixed(2)} GAME</h3>`);
            $('#stargaze').html(`The allocated $STAR amount is <br/><h3>${star.balance.toFixed(2)} STAR</h3>`);
            // $('#comdex').html(`The allocated $CMDX amount is <br/><h3>${comdex.length > 0 ? Number(comdex[0].drop).toFixed(2) : 0} CMDX</h3>`);
            $('#juno').html(`The allocated $JUNO amount is <br/><h3>${juno.balance.toFixed(2)} JUNO</h3>`);
            $('#likecoin').html(`The allocated $LIKE amount is <br/><h3>${(likecoin.allocatedAmount / 1e9).toFixed(2)} LIKE</h3>`);

            // let pstakeHtml = '';
            // if (pstake.success) {
            //     let pstakeBalance = Number(pstake.result.airdrop.tokenHoldersAndStakersDrop) + Number(pstake.result.airdrop.stakeDropAuditStakersDrop) + Number(pstake.result.airdrop.stakeDropStakersDrop);
            //     pstakeHtml = `The allocated $PSTAKE amount is <br/><h3>${pstakeBalance} PSTAKE</h3><br/> <a href="#" class="btn btn-info">Claim</a> `;
            // } else {
            //     pstakeHtml = `The allocated $PSTAKE amount is <br/><h3>0 PSTAKE</h3>`
            // }
            // $('#pstake').html(pstakeHtml);
            $('#spinner').hide();
        }).catch(err => {
            console.log(err);
            $('#spinner').hide();
        })
        $('#sunny').html(`<br/><a href="https://airdrop.sunny.ag/" class="btn btn-info">Check Now</a>`)
        $('#osmosis').html(`<br/><a href="https://app.osmosis.zone/airdrop" class="btn btn-info">Check Now</a>`)
        $('#lum').html(`<br/><a href="https://airdrop.lum.network/" class="btn btn-info">Check Now</a>`)
        $('#sommelier').html(`<br/><a href="https://airdrop.sommelier.finance/" class="btn btn-info">Check Now</a>`)


    });
});