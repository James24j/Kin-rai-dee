const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// แบ่งหมวดหมู่ให้ชัดเจน (rice = ข้าว, noodle = เส้น)
const allRestaurants = [
    // 🍚 หมวดข้าว
    { name: "ลาบก้อยซอยนานา สาขาหลังมข.", category: "rice", image: "hhttps://lh3.googleusercontent.com/gps-cs-s/AHVAweomqS94GnUiDGSdcuxfwguWSvszNBdlI6RDyPVGB0Kce2GnVsDRM9YtYjxSMWekVo--3D1PWatgEx7_1ylQbtEL_uDQOO7nd2omEzJhqKP3cgObn0BCQQMIp2kjyOaN3Wq60NYV=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/dtkjuuYrTG7WGVLJ9" },
    { name: "U-Center", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepMg5R49hUKkfD8ZOL8kSxxXOqcdMjZrk7zyzrCRoFV_o2acDwloK-iwaUBOoN13jKvHBTXsDXXUQKjccK7GvXbJlPA0oizBFvHNKQzC_UPITYafT2cJF0mFLpIho3cSIboR4Ok=w397-h298-k-no", mapUrl: "https://maps.app.goo.gl/S7zv2Dzx641PcPXo6" },
    { name: "ข้าวมันแซ่บ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq1qNkOuaiQ8yWbCZrZH8aBQLQnbu3YX_mCX6Gl52-W4LiDi5WuKQ9t_5pIXdwBE5kdryUn_MujyP5P3bDYaw0rUhmYUmPmeZTrICAFWhIjAKEmrlMEfwqfY1aynz10rpbSJsoboYMwyjU=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/P9yAiMa3zVzSx4s37" },
    { name: "ร้านอาหารอิสาน ย่าน ม.ขอนแก่น", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerzMIQIznXT9TISNKL_zN067GY-6RiykUWJT6R_jVEUEu05U3TvhjOsY3PoicdDdWGKwDoneSrU3XXIoEs9B5fAQbYMOEev7TnIE0QkHozti1J5DJ6SBdfQUmj9lMtTLq-_fas-qq6JbVug=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/Mxj236dtcnyafDbQ8" },
    { name: "INAKAYA", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqV0UGHYJK2hhLi8iT5EET_axtcVKwJEgHos5mMttSsGbrdx8Q4zh9T4pfq7Nimv8w7SwbrI-6QmQZPqVuZIDsFLn3FTFITkVrwpJU5waCvUu7loCfSnuzglWfb7gAvd5Zba3NX=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/d4KinaUmnuXtQChL9" },
    { name: "Nari Curry & Milk café ข้าวแกงกะหรี่ญี่ปุ่น - หลัง มข.", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq5oMnKbsTyOwuYf5Lvrlzp-xCUJwdW2kqUZh-XHvBODg0cxTzTcVYipv4edJ2l6UxmWaJmKB1t3xt-iHvBLaJbNN5CaWprE0xc1_XzPqoOPTuYE4WLzJyo3cAwERQOFRZfnI4=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/wByTwrkgget2FdrZ7" },
    { name: "โจ๊กหม้อเผา", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerbf8YdXD7xK3aIaZbgeu-pSIDJZswgUS0tOx-0CAKyAdfuzKWmp0bVsCmb5xWfpEwqjdvkqwXpg6IasCLHE47hKRSvOuk1ulQouVctpr4YSQN2tAbChRmF69zp9WW2A9CvIulH=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/atqiA1uadnydJHbW9" },
    { name: "Katsu Curry ข้าวแกงกะหรี่ญี่ปุ่น สาขาหลังมอ ขอนแก่น", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerUYAevcdi3Gqi49hsJflkLQe_F4ncwKmgYsgUmqmCPwxXYrXmL6hiKuCm8kz8aLC9GMzOOmriTde4JVIqUFxA2oCi5W-Y-rWHAC6u9hKkmoNIjDlseOLCADBk66c_La2CsBPi6zA=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/WX5xQD6dKbeDPMsu5" },
    { name: "แอบแซ่บ สาขาหลัง ม.ขอนแก่น", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep3UwdlCSm1hOA1MMxhGnvlWEaXNswlvZeuBhb_FjQM_EOPLP85deHFtA-dCsyU4PstrjCsY4dhhLxIb9sMw_QUdiYnR0OpogjFuVbARkE1zaVK7C4bxt4ZSMYJSyGOe_lvsDi8=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/5FdKhkXgHfQtPjJA9" },
    { name: "ชิมหมูกรอบ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoNdsVWA0q8AnrKfNOxGFWwkmzyy0FI2D5wBSVIx3menesdjofUaYGcMa26MBmXc1B7k7BTlpmBNQgDbubpmrsAYmyaeWlvKO2iXYIzsHH2MGetQrsJ3fM5jF811dXmdEIyqZYhK3Qug3PW=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/2GgeQkXhjRD4omWC9" },
    { name: "เพื่อนละยำ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoCxPYms37xAHiFMUR0thJ95Z3eJ26P9XDWqmpb5RApAxbCS95JLL3jSMJOt29XfByd6ckYWeJ2S3PH49TOcfQBMFfgRwkT4LxLnqNTifXMUQpNmHfnTFBrGV2scLn9K3Yv9wrLTv6kufcb=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/AJpgd4J4eCifdkCr7" },
    { name: "แซบม่วน สาขา หลัง มข. - Zaabmuan KKU", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq_7IoZI3lpDQY8BKT3ox3_9dptUaiB8JcSXqlCP_98u776WS6QwfnNVoO2aSestm5rv8qbY2iFd4Tl1TzVS9fL7B1cFIv_X9oMaWN45GHnz3Ud8sxrLzMZeID8lwqGSEnzrw2Wq3UJZ3qE=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/tCQf2FhDCPjgQSMc6" },
    { name: "สเต็กลุงเมล์ สาขาหลังมอ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqMIAjwHbiJrONgi7fTGXNwEU9ORuoLfPBPFYM8sScm98g6FiYo6_P8hyvN0D98Lv4jx_PDmsQ6PGpTujKlPV2fr6TWjWLv1t78b1GaBJLgYt3jPOujrbxNx4Ie3DXsDJJM5W0=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/WmpKRxQKMMnUVgYp7" },
    { name: "Believe Curry ข้าวแกงกะหรี่ญี่ปุ่น", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepFNknDMmxU2o1oGPBn6xHADTzry5HCM9I5d4wAPDxkDR2RF9gbel4lIqRibwfuwIX2WyaL8AI4DQ38OuTBcYlZc4WnJfX0toyQ0PiAC_xuufn6niMvF81uOpS05aGaRsS-dx9p=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/1FtatHadgMZrnq4t6" },
    { name: "ตำนัว ครัวลูกชาย", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqDy8x7CKYX16vZJU6RePu2-3zgswUX5Iq_HII3dul1-N7dfGCe88cWaNuLWogRwyXuitzLChWon79ZHTpJwmE1hw0cGePeWePWkYrQp8ZYcHtQKYIqscz0MisZ-fN5SHEZETwC=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/hdhih2uAVRE45jy96" },
    { name: "กินกับไก่", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqVT2CdcDT3MV3u1ZuphjGpE8IpfWPaf-8GYRDerbaTkcaDfUeJSs7hraZknu0WfzV6UGttBspsuZTzeZHyR9EFmHo4oVs1mi8HIvfCOyDl2RzmJP6KojDEqrnrm2LSKaenzBFU6KhFYOn9=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/t6e7b1wv8EuUhpst9" },
    { name: "PINARE พินรี - หมี่ไก่ฉีก", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqLIPnuqFE1ou5L-K1F38IfgJlsZ3Cks6OzeZRKTIY8ETSzUskT9ADX-FVPsB24JkmXhV2UXCZxeRgkoUevyI59yD9AfBkEoRtsB3rHhE1MOsMQTfzppbyQODgoHBEOxMudYtGBVowMOwMQ=w397-h298-k-no", mapUrl: "https://maps.app.goo.gl/h8hAMEvFpZ1bhb51A" },
    { name: "HANGUGMIX ฮันกุก มิกซ์", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo_VEuQ2jeLDuEeOabI0F5wICcYHg5ByKp73ssyKpOZ_Abj4ddhO-RQREuqwfTtc-B3WZA1IxxWAr2zYBZKWgAtQ0TrsbWW6WG7zOJ3q8yqq50CQvF-nnPXofEXei7nTO6EGt0L=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/vof3vKeAWb45yxad7" },
    { name: "ตำเฮือนเฮา", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqOrcCLjGDLhDzxBxp9S5MCxEGo5MX0-qTSKnUccJLom81H_lME2-1LZRgGTY91twzCzq55f35Nit61uEckqumwERocFskILlbAAakKHyyAJTTuOKIv8VUjt9NX3ASjimzutckRo3EOvXM=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/GWrVxbbJFJEAQCZ16" },
    { name: "Miyoi ミヨイ- มิโยอิ ขอนแก่นหลัง มข.", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq0XItydIzZAqwUTLNf0aYrB_h4DxeqznW9yrcW5V4uZjTWpicXEk9pXBsVacOXjXzG-GY3p_c2VpZBbhaKzfVbaLtajE3HUAC1CoAiUs5PJzg_3XHW5H7y3KCY8crlEVDibasq=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/nMyj65SAEEFW2F7m7" },
    { name: "ขอนแก่น แสนแซ่บ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerKekq3FZdLpd0ODQ9eve4H_s0KIeL6rJP0PuZ2zDT01dXwluUT6vbD1LVJ22Bln0DIoB2w4ZMjOr6yOzZNnUDAkoWyfTccl8rDdeNrSpIswqmSthZxzv_fse72ZplX7gLffWRc=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/P8pn7opGbTVhTXm7A" },
    { name: "สเต็กนายโก๋", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwequmerqeCaf6Q71J6nRMSvZN6-Gsc11E6_qcZI9klpUUuPEpcKL2r0AWnyEdW3vkOtVWMAC1nFP4kElFwTr72t6OkW1u_8ZQMKffqZY1lcIyDpOaBr7r_lH-Us3riD80ri92UXh=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/cSKtvobFW6k1F2Bs6" },
    { name: "หมูทอดกระเทียมพิมาน", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerKEwRWMHpNGBJ_ONfRpzI5yKlS601bbDcAgNzY0_0ZdPLIJ9ac-XpFV0A7u88MkM9rzVHJJCYqo5dUjmubL2u0Q2nmomeI4-5Uj-KYZGsQto2iS8pyr_vpX7p6ZodNnxdaVhQ9fA=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/BMMJ1LD9jbmK8JsdA" },
    { name: "ไก่กะต๊าก", category: "rice", image: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=TWostKUkt92cnCerFKP10A&cb_client=search.gws-prod.gps&w=408&h=240&yaw=338.42374&pitch=0&thumbfov=100", mapUrl: "https://maps.app.goo.gl/EiMPZL2crCocSyXH7" },
    { name: "พิสมัย", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerEC8mSzgnPtKWsCCzR2P9m9qJ3PdV_E_jq-6BPruoOw5KDGQZQDgYhB0Ga9ihyszpAuwbXYJpHccwnz3WVBV0HjzzRYEz9faAwfU1Ryrhju9xlJNUa5K1uD5nKaz0o93NXh9Gf=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/8t41eXnpk1UsbfFw8" },
    { name: "ตำเมียป๋า", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep_WzGIFt_rlNGtrThhTo_QctupFXovjahr7ZkXae8iN8pyV73LQjJkXy0mtqSseIPUeKF80PlDK74WEYAnLfjnIvgFq27iDDS0hXgLdhqjRGfqNcJOMoL1Xp0WZnd5usUgKd_T=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/wCaSamb6v2QZQgc6A" },
    { name: "โจ๋น", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerB7M_AiZ73XNrhUgu3LfNv2ApPeoBOJxAELvCdfCc5wEdyKtg9LhkDT8itfcdkwwF9LQu-1VC5LwVQc_TaCR_wWwocjKdUyLib8K0zQmHrjH2tkDG81wGQ19-gKoEfhwqA5fuG=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/4z8WZQManHmRuR5S6" },
    { name: "ไก่จ๋า", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoETuJv51x8jmJ-wq6P_4MTDHV0MCI5gEUNsw9AjrlyNgN5pP4m6QrlBKqfXZxLhCkK4PdWfV4l0FjjoSV3yUGivyXLfPYyPiIRaK0vFbIUGX7YHIlBVyevCAEzRx1VZKoY6So9KmSGsgYc=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/7pCXAbjtTc1PJUct7" },
    { name: "โคเมะ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerJMdQunRKBJwQgT_Ly2kBNj7ZuQOqyc7V5WT5Wxb1e7YAZI5QxjrK9h7IfGVGjlW3hTPpkOdDsCaZZ68pNDR9COGNBcuMl3z98FlGHjmMjsH45ZPZwq3awOM0yAIdSk5N-PHxC=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/u6t4Nbt6NBU8TDGd6" },
    { name: "ดาวสเต๊ก", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoZ5vgLEI_YeD4uo99za6CVMq6tpSVPaHMq8cFzIjKVvUUFvv6FmMdXFlACt3VkrH5roeElwFr1zk68lNiief2CJhPX75FwqSQG9OnX-nz8giSi-jWjmrAxzYeWw9-60HqxbpG0-g=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/UnG4a7yhTyDswCPg8" },
    { name: "โจ๊กป้าแดง กังสดาล", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepge_D47Ne8jNvwqiBGBdnXreCyDGlvzcZ2sB_iDr18RCeEbODIHlHuXpj49h2-ttR-phYDCiVgn4Q0gIamY-F76zKb-RAiJuSD4uYeORI-dH1731TcxsRVoFY5VJjGQGNQbmIdJw=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/bsMwaEH3M1kHZHsFA" },
    { name: "จิราพรไก่ย่าง", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweryP3GCFuXqxw3dsAr4dZS8NTgK-WpL56jTS-6MpXmwisRJJvshpt48RurG3pJFndw6ZjCqeFHVv8Gcjy4GGVzpX8ECs6GtCOqDc7D4b8Azhx8Z7DAAop4MQcAj3r9D3LYM3EyoRg=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/BrbUWoDeUk2kqCuR6" },
    { name: "ร้านตำโคราช(ตำเมืองย่า)", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerrXAzS2gvFTMlvzlAnuSZqic7nM_IPDC0EYiT9QmaOKzEbCScx4FpFzFzvlqWIHHvCucJ4JDhxjAUw9B37CykEUGgqx4wYuTaS2zmEOWN1MSXsmmKceBVjHSSfVAf540IGsaPL=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/mZoPL8zSD9NmCB4m8" },
    { name: "Shungyo (ชุนเกียว)", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoXVawEqMI991AqBPC8q64ROZNPIsxlfVmf_BxwZMo3bk9Cy3PzNqJhEu403hejDVw8xbd26ao3nbtSPsVAs_13t6WsXyNI9zRhIlrYbnCsJWiyXrcpgznKW2CqKFQSuX2kc6GhDA=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/GGfN5uVCZoRPHNen8" },
    { name: "บ้านหอมรัญจวน ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepdgzQU4ZZ44JcO8afYbjaRjzOjJuTI_7oo2Ss8hUoWqowqkorZGRI88Re1qcsrsBUIjB6JLNkrjdeEQUB1g_KsDODe1ROiqnPUvNPO82cncQW5n1FhsahsXTHmzY44Ycgge95WDQ=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/SxMLGvyXKJALTnZP6" },
    { name: "ไก่รสทิพย์", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoPIllPDu39CpB-fwWvPGPRLBVWtMt3mf1iBPCrVEwsfnWqG0H-D3rwYMqXdg0N067teGAXGvBf02sISQIAHka4PbQVbDAWH-xkGEcI5MOZgCRekbASeKafM3xdbKyd5dnCH6I7=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/faZpHhAccCRgfon4A" },
    { name: "มาเนกิ​ (Maneki)​", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoDFAxOBfU0WmeekGMPzI0V8WZ4ClGgseqzUHBD9vdKZmvYXqmZtg-u_lDROYI0Bopz34RNhHWOAyPvrDC_e6gsAvcCe9w980Fb9Vz-LWD2h6t52-5-UTOHzLcLMWyekBDQx7rw=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/4hwfhk573xcTtE696" },
    { name: "ตอกไข่", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweosdRMYdVq0A4mQbCcf07HLmFxONmiHlgd8GpmDb1lv2hW9tWKmVFeKnUr3HwULZ94oo1kwXiob5nfqRBD7YRbW9fSzAEKOdQzc9d_mSVmOCOqRpdYMVTXvWDHJ-Yjx9fh76uc9=w227-h298-k-no", mapUrl: "https://maps.app.goo.gl/kqE2phrHzWfNZVG18" },
    { name: "ทองพูนไรซ์", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq-b9Jwv83R3nk9yxSSPFHCDuUl9-T3lgvQ9HOjvZEbPMvKde2VKe3Ecb3EbfMXoqfUtiEEUqdRlD3JZdZF158zrofg3d6op91q5fIvjseqakKtKAfIeUxBNSRnJdoH7B8NPb0=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/ZfKjB5xugJWCM1e97" },
    { name: "ล้ำรส ก๋วยเตี๋ยวลูกชิ้นยักษ์", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo-HCtONtbx0PP7XcXNc1h1uJK-XZqKpwn6Bjxx52UrfNqU09pZ-MjI-Ae46UwIxNlkYUMF7bWOLL89of-ZBAo8QXIeKHl46UeO9TS6-xB2lWkCzN3gfyL9_si1mPeTi6WSq2bb=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/BbCSJdtCRSQ3twtW6" },
    { name: "รสดีย์ Ros-Dee", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwer0CQesFFatjOjnyXQUvpm5ZRbmYNxvMO74TBiujptfFdLk5RYltknNKg2f3HAthcJZgqfpeAr67bbwNO3X16YCmoeuz0DiDYEhPRuY3yo7GhD_69xi_ta3pCjgWbK_A8b385U=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/mgfAbXcExvT5aFnX9" },
    { name: "Little Osaka", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweps_fz5dL7RIw4JV38eeCuITBqBPIccVpNm1CPoOvxhYPy7c3eOkLB0XEAQGaHJwdD7deN9zo-umLhHeY20ijFnnmO8bRUXPrpuNk6DFXhZ5gFU-6l7JDVAtTHq9wollGWCf2nB2w=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/Lpfo2GM48JfjaCiz6" },
    { name: "VERY CURRY", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerqcZc0GBJ-3krCy3n7DNvtKuzyai8cLNtY_b-jmKOSBSGVhoR3RzvzjRd90PVytD131xGq3PI2xHw5WjBFjeGCQkk2PUaHvS_Ccc9xxGVMakWLzloRHNIsmmV1qL8Hncg_Xv9Rtg=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/p2yujVvV7zKwXkS87" },
    { name: "Amusant steak house", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweodEG743cYiZlbnmemhBKUtyUILI2MjCCS0cUmH70d48rJDC_sVovACFkCJtAhzpFUbUSGuBJ4eLUU98WIE_VhYgfyO-PRdrBUohigr83ZLxrganwXucfNbpVv_xEZPJJg5cd4=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/JDM9GtpjpCg9hDZK7" },
    { name: "DAKHAUS", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqjvbBiFCgQ_lX5Y4oCAh022LoF7B_Lrbpt3J063AdoPDM_Ocf0vrrXcrwY5lrSyRlAoA3lH-Gc-LX1jSmau6i3a67hV4jN4h5Cb7BLoTLTKtYLYaLqZZKI0zJd3owbJBxJaLYX3lyfh-zD=w224-h671-k-no", mapUrl: "https://maps.app.goo.gl/aQ51EJYDxxFaQqXY9" },
    { name: "Steak BKK", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerG5youegdrcNG5hkNKSGq38HuA8ysNKyAqNvbFxcj5blF5XwELgnmyiBIUfqmT-zhZAhI_6okTgVGP1AkSM5FL_JudfyEy8mY3jD4ahK8WbOPJyUAePKtuW87OJbEaacVXIPD45g=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/BN5BycJGhK4Gi9My8" },
    { name: "กะหรี่อยู่หนาย カリ－ユナイ", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqxvbNovWq6MxTQD-avaMaEs7S6gwftQrxmR7FLMzehGHwrjZwFWFexAidQBiXJDAHvtqXcctF1_bQYpOkuMUGLJUfPVluZ5OfrPcOoFJ6oI2YHyVe4VI1fsyo7nMsWPZ2v6uhMhMxj2pPN=w447-h298-k-no", mapUrl: "https://maps.app.goo.gl/vDdFsmetkwqLU7qe7" },
    { name: "บ้านสีอิฐ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweov3C7OA3Mjg8MEGcY50GgPb40sc2FPXoPtPdhQLjz9lfwNsIXdKaTLMvYwMLuGtojmC2PjsW0Xob-kh84I4_rwqfF3XDZiPgtHRzX7IcHxPQScDgKiiX1o8yN1ZIxoC1_Qou0E=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/2RtmnbhFSL5bJ1gg7" },
    { name: "พ่อสนั่นลาบก้อย", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo_HuNkOEfFMw8qw_6mpx-xCWtqkWON3bSrIRVKuhtXxdvLANAXCA2Bjp1J5E09NHPeu05jHfE4U2RehiFOvwcZtLVLi88GoB3xc5MCWpY62v5n2pdKPZU0hpqAr6VMz2a4MZpQ8w=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/DP892Gj48EFwvT2p8" },
    { name: "มิตรภาพลาบก้อย", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq0X6EmI5gcUSnyE0c09UCU50UHgzuRoXHYmSvkr4Z4aP46WRpVQ5zBDZynRjuN3wwcGuJF5-U0ZNOnhbhQdBqb0GA2xQfC72CECw8VpZDn-sMvFCDfgBpOO06djejm2iucgnJ6=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/AMzvys51bha3dLkY9" },
    { name: "MIDNIGHT SOON", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepnPwHS0KTv8PEtTNi1wVGVn8i_rD5DxJX5dptPkMJw1hVZeJuUCIezxgGopwreqbi-lg06C9-x3bGfVCrkB8teAhy3Ucrvx-x4ZkixDN0EEIryp3fTD0Tem3EE-zjysyM1_28L=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/UuEzt1BhqMUfh7BW7" },
    { name: "ต้มยำทะเลเดือด", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweru7ZCtNxTexuW3z8y5SIWBhD_X9HMdElDkSmrTiiqUASJSCCq9jkuZT2D3X93BsE331wEvTj4moUHgPO7qalwYW3CAA3gPdfhWMA5BpQ_4-sSgIyPunO9al7TnhovURzmqRvR-=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/6RsWZoeULvJQMCT49" },
    { name: "สเต็กลุงเดฟ", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqg07PlT9vLr4wEf2SC0NwyepJJSQEUITKdCatY_1xgzORcKtO5VccyIbaYQ_tNutwW8hJap73a1WDC5x-Hmm5fjt0UTvu9PdlPIvJl8f1PcS5R8sJlLeqLsqbLgd9cO3KEuI3T_vFxn9Bf=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/zMia5Dbkqty8aptW6" },
    { name: "ขวัญข้าว", category: "rice", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoMB9rGo7NvIUd8oXyH1KJPRI8iflrF24qLLaEvKVUiZxZ6A3PK5QsADWdo2M9WFRrvdM7nc1V_UFHPcph_u-Wom141ZPNz9ROssvRfSp95IWrDKW5sSFqfipgIdsx8XjZgJiJBFD9G_UwA=w224-h497-k-no", mapUrl: "https://maps.app.goo.gl/ChZox3ChmU95K6pB9" },


    // 🍜 หมวดเส้น
    { name: "ก๋วยเตี๋ยวเรือคนวังฯ", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq_uJLfowVGB35MHDEslL5CgWCM-Det4qoTiCkKE4mz53GL6ny4Y3SQaa8iKfEwGmlBrY1RvjrzCdFGcvX0BK5MTpV8COOYHF7jn1zgyOKm-hOl0vk7Q1UbDqXRH0knns92uQjkiQ=w397-h298-k-no", mapUrl: "https://maps.app.goo.gl/mnwUukHhL8R3sGHq7" },
    { name: "บะหมี่พ่องตาย", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoq17Ct2nLAOzV93-wVz25lUUdiDi-Bx7ZGOYHfpabCSdBbEJoAswneSYHp7CMmUgnmlqJ4N6t-UTwHejw23U33zzoLzCvjYIqU0AAFXAbNixgeHQ7u2Znkte9tMisknBjOsFxK=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/tE1AVUZa6j6tpz4MA" },
    { name: "ขนมจีนโคตรข้น สาขา มข.", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqlLCFKP-sBpvMc-VL8x53IV3gieL-xrzuF1otE-9IrQhlzy4qTtgokXX3M2bNPQb2eYBzwsP4FWb1xVLgAGfehuoI37RmY654P3AdX2z3QmrlKAZui3oGF9pzGFcNejSlpaf8=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/fN6BrQwb8AHCQVeJ7" },
    { name: "ก๋วยเตี๋ยวเรืออนุสาวรีย์ชัย หลังมข.", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwertUWRHMsRulAXghm_0c-ijbOiqMbukBaP6JIrnHeSIGGsaF9Wx8Wm9243xgUMkyJ1gJPCVEpnmp9z5sQH6tfckvklpnVKOW_Xr6u60jioK3BlFK7CTr7iXhIMCSwYTJfqTI2LQ=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/AL1ZB2DMJqG2g6Q66" },
    { name: "จิ๊กโก๋ 'เตี๋ยวเรือวังหลัง", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqIsXvL6FJqfcR1FH8pWGMRYnspyPRPBWYpiUlhXZCs6MSV6cSmigrNu7rLxlRq6F48AbASJpdpO-nkg-mjIAqVX2c8GuTjXVcwBztyOTLFuXj68GAJkiO2TMsNq7V6gQg6iRVadA=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/tjasp3HDFFFXKCFe9" },
    { name: "แซ่บดาดปาก", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqWE868Ye3zkhcVrjTjLPelDTk4Fd9IJbnGs1Iz8sKg5brjOhID9vDLLu2x8aCp5bdQIBF7fWTub_McIz4W4a46gHTjYw6ElIx_C9uDk8yVG4K95GzSZfI4UD6SRX693fiveCZVRw=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/3M2v3FdcN4WdzNXw9" },
    { name: "ฟู่หยวนหม่าล่าเสฉวน", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep0hwhNnUABk7QL6W8B0PWnwp7rE0SfeMX8Pm0iXDC1ygG4mNufByGCb1-og_JpqEDEHzSBs1RmVMCsQuBAHO1noNt-rJyRBli27qSbwFk86V_Je527XgX1CLdZ8HMu7CNWXCKIqV-bd2FV=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/2VpWVqg62fhVwcYv7" },
    { name: "หม่าล่าปีศาจ", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqm2U0QuZbMo-llKxXP11BEQpiZnZ9vHVPxjoIhr-6s7m_qaC3yUQ2R9jy20ZKdlxDbhClEB0RhlMki3HpwS52yRJsA5EcAd1O2_fngQ9dmpr4CmlSsI2I60fIvj5ycMH6jo5E2=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/KE3rMzuzKfWQ4vmw7" },
    { name: "กั๊ดต๊อง", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepLEk8ItgbcYaByWHkTENPaMOXIYKM7EZcFX2DhfTtlYfckL33lbx27Jxdls_QvTtfCeLUmx21HM1GUBVVZ0j9wsveR-BiqlG6KQ1BGDZKCj-DqIyjHBr1RDlZwugVL5q7Ui3p-=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/hPDMeZzSLtM22R539" },
    { name: "สูตรเส้น x ครัวดวงดี", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepzBb9ZEYUizZZCZHlZm-VVhkoo-8Xa8OFBd6cO7_kdUa9NTYalf6n5jc0Hp2TlAYMKXaJGRa69LPSWgBHMG3U7nyvZ-GywY2hcp24hLJONjGai-XozR4ky2oDM3xzfjmVhU8frnhhXfoo=w298-h298-k-no", mapUrl: "https://maps.app.goo.gl/XWhRaJotGsA3UAxt5" },
    { name: "ติ๋งติ๋งหม่าล่าทั่ง", category: "noodle", image: "https://lh3.googleusercontent.com/geougc-cs/ABOP9pu0_YvWUp5CKTjEUCGx7WugnRuv0J9U9sOFDlL7GHcNRSeFi0TDXOa9mjQFWy3qCcb_WkMau-w_vmz_-DElY6x7BgVn2B07l4bKNrQgRZdWqX3ZcnrKptlVp1sZ9SLfZhZ8GroFHk1qW9z2", mapUrl: "https://maps.app.goo.gl/GYyvzsy68U86BXGP9" },
    { name: "โบราณ BORAN", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq5nj5TZqAFb8SXBaoCuhWUriaD7Th3tx7HEJ8wDlEY9qTrPBHJRZUEk3aVpr4GBEu200yQA6tY8PLmIQj3GwA_jbVD-e3VxN-DfyIi1zGEqWbgABwBoEw7RyOdDnHB7rMsiI23ecl25xaC=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/NzCFcTsK6wZHHGdv6" },
    { name: "หมูใหญ่ไข่เยอะ สุกี้กระทะร้อน", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerSzjAyGFRs5bFGqygfF8cTTqcLPbHlVuRGKTLYIWaWhR2-9q9RNnEc6an4wSfXxSXWJHeL2izoNkF6ot-d5fyhVFs0jiQb_KZlhNOp0SouyhlOTF4jnEfxn1aZFJqnhm8jN8fT=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/sX8pr9FHEXjxXoTD9" },
    { name: "อาหวังหม่าล่าทั่ง", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepjrXx5sFC5uaCgtLNoRUjxH3z-UuhIyp6541okIxTMMH-tFedJ6xTGKOYTjfRjwpAb3oIwmVlC-DOF-3tR6a55XNvya8b0lGgnyi4aIqJQuC94ppiMdL6PQrj5CnExMbHNsidy9s3DYzQ=w447-h298-k-no", mapUrl: "https://maps.app.goo.gl/AY4pVWvootzNzXiZ8" },
    { name: "วูวู หม่าล่าทั่ง", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo-I0zsYpsWvizfWbCEEWNoCggp1oxYtINSnznlIN8oQB-wogDbojYbb41CfasJGJgsznkbLK3quukujs4ogC7Vy62bseSvl8qg28R6GfzfQBAgt1pabJZ7OiEbSq7uXI2ebT2HiQ=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/Wb5nVDRoLk1SsMyb8" },
    { name: "ก๋วยเตี๋ยวต้มยำกากหมูสูตรโบราณ", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweri7dO_8SZakoAZxufiGFLCeLB1HlEQeXfsxRn0qwjrJRCrypbE-Ae_femonvajKseq6o5mx-7rpzysgbTP0eNxPUWiIjYnzZVRQiuB8lhFN0IefBtlBNJwH-lC82l-r8gjgh0z=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/TpaFZY2CPuFEdogu6" },
    { name: "ฟู่หลงหม่าล่า", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerO7GtQ35DvLPGZZ1EjCoChKhv5WBxL4wrvBA2_bSzFlSVJQxg_vUca_Ns-IF9ynpkP3FU8GHon_tYDF92DlDa25YheUiOpoaNVWTjJVqWtnuexuOL3rN6i2aV8igqEhQvVwSEHDtKrsXMF=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/g83v9E85ZL7PubCz8" },
    { name: "ฮอกไกโด สุโกอิ", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo2l8UapGiRKaWlTP9TG0-k29x4_SHmN_hHtT8DbT6TvJ13_O5YGEzhfY3STqum8kNz2fQYiNSSMQ1bIdLyBAfBnyn4oSmSbPIuuR1JRhUnv3RJZbNNPh6pYPM0uTTCMgZNOqyaO-JzIPwu=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/1beqvGXtGHraFbwMA" },
    { name: "เตี๋ยวเรือล้านช้าง", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqvLUAqCm7Ya7RCrgDgMSLVNBS8jvq3_Pj5cat_YEMeHSbDpFtgYv1qGGFloMnKmnrpVqESJL57j-46qp3M0btXZ3vQ1yAWfqarLDjSsMnG29X659fexIgR6rjvRaE1zWtXIV99=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/8qwkyxGebChQBn3M7" },
    { name: "ชางหลง Mala Factory", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwermrv_WApGaaJJYfO4yrNU-sxbB1YYNXJi08x5hNkLPxDoYzZNJ7OpiIU51zZV7ENQkHLYfJn3SjXBXqXCUF93sTOnyZDJiFlLjSqz-SmnVmt6ZnqxaS0P6HiwiUZhS6yy5QyarIw=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/7bzoKk54kMrGdknL6" },
    { name: "Style Soup ซุปหม่าล่า", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepXAG3ugf9LXSEset6XaTaS9-JpP6JCJHAz_T6hzJsAdal_MdJ3STJkO-NeIVAf5z_A5Rvr64LMSGMEnwKam1xlI84mOKECrULojaLEgOZUhaDM8XkyZ5T4osZ0j_lcbYxfMKWL=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/aNLdefuNXqiY3epK6" },
    { name: "ร้านก๋วยเตี๋ยวหมูตุ๋น เนื้อตุ๋น @คิงคอง", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqe4FDQbCW1c4bXm9fylrU-mWxYUt2oIu6WTUPvu4lfmPoHIfUd59AgdKQoEUKPPfEWfznoOLapP_wvGlK-4vXDAIGNcorezV8SER4C5kFuAjaITFQHAQcv5DETBlSmiiPSXkVuEA=w140-h140-p-k-no", mapUrl: "https://maps.app.goo.gl/7rgfAgALyGZQscdv6" },
    { name: "เป็นสุข หม่าล่าทั่ง", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerRKkVs5RuZw-fMffhQeiOkmN8RqYR7K9_jzBSISQNTSSHxVZb_6AEI8eHVUGh7L_eQow6xo0x95h74AP0URYaih226FcV3TY1olwYDE_69_BIc1a9dNm2y2q3ktOZg-0dRdUn8F7kv02k=w397-h298-k-no", mapUrl: "https://maps.app.goo.gl/xQeCZNoQEjbhdqVz9" },
    { name: "firehang.ksd", category: "noodle", image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep8i6XCm3U0zPDEzeKQJQIdjpiHLVPZqNjWXXRAHIvO8eZML1I973U4lebPsY5Jl1kCLRLlrqbHZ-GeS90FyU_dRwFYJNDcrxvDGCv4zsRyUgkAX4AXnkHEY9PmWri35nbr0igpmE4ZtM3F=w224-h298-k-no", mapUrl: "https://maps.app.goo.gl/8etsj8uuGud7JTNS8" },
 
];

function getRandomItems(array, num) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

const rooms = {};

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomCode) => {
        socket.join(roomCode);
        
        if (!rooms[roomCode]) {
            // เพิ่มการเก็บสถานะโหวตหมวดหมู่ (categoryVotes)
            rooms[roomCode] = { 
                users: 0, 
                categoryVotes: { rice: 0, noodle: 0 }, 
                categoryFinishedUsers: 0,
                items: [], 
                votes: {}, 
                finishedUsers: 0 
            };
        }
        
        rooms[roomCode].users++;
        // ส่งหน้าโหวตหมวดหมู่ไปให้คนที่เพิ่งเข้าห้อง
        socket.emit('startCategoryVote');
    });

    // รับผลโหวตหมวดหมู่ (ข้าว หรือ เส้น)
    socket.on('voteCategory', ({ roomCode, category }) => {
        if (!rooms[roomCode]) return;
        
        rooms[roomCode].categoryVotes[category]++;
        rooms[roomCode].categoryFinishedUsers++;

        // ถาทุกคนโหวตหมวดหมู่ครบแล้ว
        if (rooms[roomCode].categoryFinishedUsers === rooms[roomCode].users) {
            const votes = rooms[roomCode].categoryVotes;
            // หาหมวดหมู่ที่ชนะ (ถ้าเสมอกัน ให้ข้าวชนะไปก่อน)
            const winningCategory = votes.rice >= votes.noodle ? "rice" : "noodle";
            
            // กรองเมนู เอาเฉพาะหมวดที่ชนะ แล้วสุ่มมา 5 เมนู
            const filteredItems = allRestaurants.filter(item => item.category === winningCategory);
            const selectedItems = getRandomItems(filteredItems, 5); 
            
            rooms[roomCode].items = selectedItems;
            
            // ส่งเมนูที่เข้ารอบไปให้ทุกคนเริ่มปัดการ์ด
            io.to(roomCode).emit('startGame', { category: winningCategory, items: selectedItems });
        }
    });

    socket.on('swipeRight', ({ roomCode, item }) => {
        if (!rooms[roomCode]) return;
        const itemName = item.name; 
        if (!rooms[roomCode].votes[itemName]) rooms[roomCode].votes[itemName] = 0;
        rooms[roomCode].votes[itemName]++;
    });

    socket.on('finishVoting', (roomCode) => {
        if (!rooms[roomCode]) return;
        rooms[roomCode].finishedUsers++;

        if (rooms[roomCode].finishedUsers === rooms[roomCode].users) {
            const votes = rooms[roomCode].votes;
            let winner = "ไม่มีใครอยากกินอะไรเลย!";
            let maxVotes = 0;
            let mapUrl = "";
            
            if (Object.keys(votes).length > 0) {
                winner = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
                maxVotes = votes[winner];
                
                const winnerObj = rooms[roomCode].items.find(i => i.name === winner);
                if (winnerObj) mapUrl = winnerObj.mapUrl;
            }
            
            io.to(roomCode).emit('result', { winner, maxVotes, mapUrl });
        }
    });
});

const port = process.env.PORT || 3000;
// เพิ่ม '0.0.0.0' เข้าไป เพื่อให้ Render เชื่อมต่อได้ชัวร์ๆ
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});