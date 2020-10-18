const http = require('http');

const fs= require('fs');
let requests=require('requests');
let homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal = (TempVal,OrgVal) => {
    let temperature=homeFile;
    temperature = TempVal.replace("{%tempval%}",OrgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",OrgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",OrgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",OrgVal.name);
    temperature = temperature.replace("{%country%}",OrgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}",OrgVal.weather[0].main);
    return temperature;
};
const server= http.createServer((req,res)=> {
    if(req.url=="/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=brahmanbaria&units=metric&appid=5d6689818613ac9263790406144a1fb8"
        )
        .on("data", (chunk)=> {
            const objData=JSON.parse(chunk);
            const ArrayData= [objData];
            const realData= ArrayData.map((val)=>
                replaceVal(homeFile,val)
            ).join("");
            res.write(realData);
            
          
        })
        .on("end", (err)=> {
            if(err)return console.log("Error occurs");
            res.end();
        });
    }
});

server.listen(8000,"127.0.0.1", ()=>{
    console.log("Server is ruuning to Port 8000");
});