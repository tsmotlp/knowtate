
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import axios from "axios";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { text } = body;
  const salt = new Date().getTime();
  const appid = process.env.BAIDU_TRANSLATION_APPID
  const key = process.env.BAIDU_TRANSLATION_SECRET_KEY
  const domain = 'academic';
  const from = 'en';
  const to = 'zh';
  const str1 = appid + text + salt + domain + key;
  const sign = crypto.createHash('md5').update(str1).digest('hex');
  const response = await axios.get(
    "https://fanyi-api.baidu.com/api/trans/vip/fieldtranslate",
    {
      params: {
        q: text,
        appid: appid,
        salt: salt,
        domain: domain,
        from: from,
        to: to,
        sign: sign
      },
    }
  )
  if (response.status !== 200) {
    return new NextResponse("translate error", { status: 500 });
  }
  if (response.data.trans_result.length > 0) {
    return new NextResponse(response.data.trans_result[0].dst, { status: 200 })
  } else {
    return new NextResponse("translate error", { status: 500 });
  }

}