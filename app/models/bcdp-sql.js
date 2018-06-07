var mysql = require("mysql");

module.exports = {
    "getCon": function getCon(){
        var con = mysql.createConnection({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASS
            });
            
        con.connect(function(err) {
        if (err){
            console.log( err );
            throw err;
        }
        });
        return con;
    },    
    "getManager": function getManager(id){
        return new Promise(function(resolve, reject){
            let query = "SELECT MANAGER FROM WORKPLACE.MANAGER WHERE ID = \"" + id + "\"";
            this.getCon().query( query, function (err, result, fields){
                if(err) reject(err);
                else resolve(result[0].MANAGER);
            })
        })
    },
    "getActiveWf": function getActiveWf(id){
        return new Promise(function(resolve, reject){
            let query = "SELECT ID_DE, ID_PARA, ETAPA FROM WORKPLACE.CHAT WHERE ID_DE = \"" + id + "\" UNION ALL " +
            "SELECT ID_DE, ID_PARA, ETAPA FROM WORKPLACE.CHAT WHERE ID_PARA = \"" + id + "\" AND ETAPA > 1";

            this.getCon().query( query, function (err, result, fields){
                if(err) reject(err);
                else resolve(JSON.parse(result));
            })
        })
    },
    "getQuestions": function getQuestions(lang){
        return new Promise(function(resolve, reject){
            let query = "SELECT QUEST_TXT FROM WORKPLACE.QUESTIONS WHERE LANG = \"" + lang + "\"";
            this.getCon().query( query, function (err, result, fields){
                if(err) reject(err);
                else resolve(JSON.parse(result));
            })
        })
    },
    "createEvalWf": function createEvalWf(id){
        this.getManager(id).then(function(result){
            if(result){
                let insr = "INSERT INTO WORKPLACE.CHAT ( ID_DE, ID_PARA ) VALUES ( \"" + id + "\", \"" + result + "\")";
                this.getCon().query(insr, function(err,results,fields){
                    if(err) conlsole.log(err);
                });
            }
        })
    },
    "deleteEvalWf": function deleteEvalWf(id){
        let del = "DELETE FROM WORKPLACE.CHAT WHERE ID_DE = \""+ id +"\"";
        this.getCon().query(insr, function(err,results,fields){
            if(err) conlsole.log(err);
        });
    },
    "updateStatus": function updateStatus(question, id){
        let upd = "UPDATE WORKPLACE.CHAT SET ETAPA = " + question + " WHERE ID_DE = \"" + id + "\"";
        this.getCon().query(upd, function(err,results,fields){
            if(err) conlsole.log(err);
        });
    },
    "resetAllEval": function resetAllEval(id){
        let upd = "UPDATE WORKPLACE.CHAT SET ETAPA = 1 WHERE ID_PARA = \"" + id + "\"";
        this.getCon().query(upd, function(err,results,fields){
            if(err) conlsole.log(err);
        });
    }
}