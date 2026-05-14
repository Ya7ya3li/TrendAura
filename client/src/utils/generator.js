export const generateScript = async (topic) => {

  return `
🔥 هوك قوي:

الحقيقة التي لا يريدونك أن تعرفها عن ${topic}

🎬 السكربت:

هل تعلم أن ما يحدث الآن أخطر مما تتوقع؟
هناك تفاصيل مخفية لا يتحدث عنها أحد...

ابقَ للنهاية.
`
}
await supabase
.from('history')
.insert([

  {

    prompt,

    hook:hookText,

    script:scriptText

  }

])