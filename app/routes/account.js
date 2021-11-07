var express = require('express');
const decode = require('../middleware/tokenDecode');
const setAccount = require('../service/account/Set')
const Search = require('../service/account/Search');
const importMoney = require('../service/account/importMoney');
const remittance = require('../service/account/remittance');
const getAccount = require('../service/account/getAccount');
var router = express.Router();

/**
 * @swagger
 *  /account:
 *    get:
 *      tags:
 *      - account
 *      description: 계좌 조회
 *      produces:
 *      - application/json
 *      responses:
 *              200:
 *                  description: 계좌 조회 성공
 */
router.get('/', decode, (req, res) => { //계좌 조회
    const userId = req.token.sub;
    Search.allBankSearch(userId, res)
})

router.post('/', decode, (req, res) => { //계좌 생성
    req.body.userId = req.token.sub;
    setAccount.create(req.body, res);
})

router.get('/add', decode, (req, res) => { //타은행 계좌 조회
    req.body.userId = req.token.sub;
    Search.add(req.body, res);
})

router.post('/confirm', decode, (req, res) => { //계좌 추가 확인
    req.body.userId = req.token.sub;
    setAccount.insert(req.body, res);
})

router.patch('/money', decode, (req, res) => { //송금, 가져오기
    if(req.body.bankName == 'toss') { //가져오기
        req.body.userId = req.token.sub;
        importMoney.get(req.body, res);
    }
})

/** 
 * @swagger
 * /account/search/{phoneNumber}:
 *  get:
 *   tags:
 *    -account
 *   description: 계좌번호로 계좌 조회
 * 
*/
router.get('/search/:accountNumber', getAccount);

router.patch('/', remittance);


router.delete('/',)

router.get('/:phoneNumber', (req,res) => {
    const phoneNumber = req.params.phoneNumber;
    Search.forAnotherBank(phoneNumber, res);
})

module.exports = router;