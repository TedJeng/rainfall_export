document.addEventListener('DOMContentLoaded', function () {
    //地區代號
    let AreaList = [{
        "id": "466950",
        "name": "彭佳嶼"
    }, {
        "id": "466940",
        "name": "基隆"
    }, {
        "id": "466920",
        "name": "臺北"
    }, {
        "id": "466910",
        "name": "鞍部"
    }, {
        "id": "466930",
        "name": "竹子湖"
    }, {
        "id": "466900",
        "name": "淡水"
    }, {
        "id": "466880",
        "name": "板橋"
    }, {
        "id": "C0C700",
        "name": "桃園"
    }, {
        "id": "467050",
        "name": "新屋"
    }, {
        "id": "467571",
        "name": "新竹"
    }, {
        "id": "C1E770",
        "name": "苗栗"
    }, {
        "id": "467490",
        "name": "臺中"
    }, {
        "id": "467770",
        "name": "梧棲"
    }, {
        "id": "C0G650",
        "name": "彰化"
    }, {
        "id": "467650",
        "name": "日月潭"
    }, {
        "id": "C0K400",
        "name": "雲林"
    }, {
        "id": "467480",
        "name": "嘉義"
    }, {
        "id": "467530",
        "name": "阿里山"
    }, {
        "id": "467550",
        "name": "玉山"
    }, {
        "id": "467410",
        "name": "臺南"
    }, {
        "id": "467440",
        "name": "高雄"
    }, {
        "id": "C0R170",
        "name": "屏東"
    }, {
        "id": "467590",
        "name": "恆春"
    }, {
        "id": "467080",
        "name": "宜蘭"
    }, {
        "id": "467060",
        "name": "蘇澳"
    }, {
        "id": "466990",
        "name": "花蓮"
    }, {
        "id": "467610",
        "name": "成功"
    }, {
        "id": "467660",
        "name": "臺東"
    }, {
        "id": "467540",
        "name": "大武"
    }, {
        "id": "467620",
        "name": "蘭嶼"
    }, {
        "id": "467990",
        "name": "馬祖"
    }, {
        "id": "467110",
        "name": "金門"
    }, {
        "id": "467350",
        "name": "澎湖"
    }, {
        "id": "467300",
        "name": "東吉島"
    }];

    //年份
    let Years = ["2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
    let finalData = {};

    let RunData = (id, year) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch(`https://www.cwb.gov.tw/V8/C/D/MOD/DayRain/${id}_${year}.html`, {
                        'method': 'GET',
                        'mode': 'no-cors'
                    })
                    .then(res => {
                        return res.text();
                    })
                    .then(result => {
                        let ele = document.querySelector('#DayRain_MOD');
                        ele.innerHTML = result;
                        let script = ele.querySelector('script');
                        script.remove();
                        let child = ele.querySelectorAll('tr:last-child > td');
                        let data = [];

                        for (var i = 0; i < child.length; i++) {
                            data = [...data, child[i].innerHTML];
                        }

                        resolve(data);
                    })
                    .catch(ex => {
                        reject(ex);
                    })
            }, 2000);
        })
    }

    let GetData = async () => {

        for (var item in AreaList) {
            for (var year_idx in Years) {
                let response = await RunData(AreaList[item].id, Years[year_idx]);
                if (!finalData.hasOwnProperty(AreaList[item].name)) {
                    finalData[AreaList[item].name] = {};
                }
                finalData[AreaList[item].name][Years[year_idx]] = response;
            }
        }

        return finalData;
    }


    let btnAnalysis = document.querySelector('#btnAnalysis');

    btnAnalysis.addEventListener('click', function () {
        GetData().then(res => {
                console.log(res);
            })
            .catch(ex => {
                console.log(ex);
            })
    }, false);

    let btnParser = document.querySelector('#btnParser');

    btnParser.addEventListener('click', function () {
        fetch('data.json')
            .then(res => res.json())
            .then(result => {
                let csv_data = [];
                let tb = document.querySelector('#tbData');
                let tr = document.createElement('tr');
                //固定區域
                let th_fixed = document.createElement('th');
                let csv_header = [];
                th_fixed.innerHTML = "區域";
                csv_header.push("區域");
                tr.appendChild(th_fixed);
                //新增年份
                Years.forEach(year => {
                    for (var i = 1; i <= 12; i++) {
                        let th_year = document.createElement('th');
                        let year_value = `${year} ${i.toString().padStart(2,'0')}`
                        th_year.innerHTML = year_value;
                        csv_header.push(year_value);
                        tr.appendChild(th_year);
                    }
                });


                csv_data.push(csv_header);
                tb.appendChild(tr);
                //資料轉換
                for (var data in result) {
                    //區域
                    let tr_data = document.createElement('tr');
                    let td_fixed = document.createElement('td');
                    let csv_detail = [];
                    td_fixed.innerHTML = data;
                    csv_detail.push(data);
                    tr_data.appendChild(td_fixed);
                    Years.forEach(year => {
                        //年
                        let rain_data = result[data][year]; //每年雨量資料
                        for (var i = 1; i <= 12; i++) {
                            //每月雨量資料
                            let text = rain_data[i - 1];
                            let td_data = document.createElement('td');
                            if (text === '-' || text === 'T' || rain_data.length < 12 || text === '') {
                                text = '0'
                            }
                            td_data.innerHTML = text;
                            csv_detail.push(text);
                            tr_data.appendChild(td_data);
                        }
                    })

                    csv_data.push(csv_detail);
                    tb.appendChild(tr_data);
                }

                let csv_text = '';

                csv_data.forEach(data => {
                    csv_text = `${csv_text}${data.join(',')}\r\n`;
                });

                console.log(csv_text);
            });

    }, false);


}, false);