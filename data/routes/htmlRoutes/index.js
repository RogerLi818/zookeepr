const path = require('path');
const router =require('express').Router();


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../../../public/index.html'));
});

router.get('/animals',(req,res)=>{
    res.sendFile(path.join(__dirname, '../../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/zookeepers.html'));
  });
//need to be on this order. otherwise it will take precedence over named routes.
router.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../../../public/index.html'));
});

module.exports=router;