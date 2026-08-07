/**
 * data.js
 * ------------------------------------------------------------
 * このファイルには「見た目」や「動き」は一切書かず、展示ビジョン
 * ボードの中身（テキストやリストの初期値）だけを置いています。
 *
 * SEポイント：
 * 「表示ロジック(app.js)」と「実際の内容(data.js)」を分けておくと、
 *  ・来年また別の展示で使うときはこのファイルの中身を書き換えるだけでOK
 *  ・app.js 側は一切さわらなくて済む
 * というメリットがあります。これを「データと表示の分離」と呼びます。
 * ------------------------------------------------------------
 */

window.VISION_BOARD_DATA = {

  // ページ上部の基本情報
  meta: {
    venue: "AAA GALLERY",
    space: "幅80cm × 高さ180cm"
  },

  // mdファイルの mermaid フローに対応する10段階
  flowStages: [
    { id: "vision",       label: "①VISION" },
    { id: "concept",      label: "②CONCEPT" },
    { id: "experience",   label: "③EXPERIENCE" },
    { id: "requirements", label: "④REQUIREMENTS" },
    { id: "design",       label: "⑤EXHIBITION DESIGN" },
    { id: "expression",   label: "⑥EXPRESSION" },
    { id: "output",       label: "⑦OUTPUT" },
    { id: "action",       label: "⑧ACTION" },
    { id: "schedule",     label: "⑨SCHEDULE" },
    { id: "check",        label: "⑩CHECK" },
    { id: "supp",         label: "実務管理（予算・リスク等）" }
  ],

  hierarchyTable: [
    { stage: "VISION",             desc: "この展覧会で何を達成するか" },
    { stage: "CONCEPT",            desc: "何を軸に展示全体を構成するか" },
    { stage: "EXPERIENCE",         desc: "来場者に何を感じ・発見してほしいか" },
    { stage: "REQUIREMENTS",       desc: "絶対条件・希望条件・制約" },
    { stage: "EXHIBITION DESIGN",  desc: "空間をどう使うか" },
    { stage: "EXPRESSION",         desc: "どの技法・素材を使うか" },
    { stage: "OUTPUT",             desc: "何を制作・用意する必要があるか" },
    { stage: "ACTION",             desc: "制作・発注・加工・設営など何をするか" },
    { stage: "SCHEDULE",           desc: "いつ、何を、どの順番で行うか" },
    { stage: "CHECK",              desc: "何を満たせば「達成」と判断するか" }
  ],

  designRules: [
    "ユーザーが決めていない作品内容は補完しない",
    "作品の具体的な構成・6人の設定・関係性は新たに創作しない",
    "展示方法の提案は「別途提案」として分離する",
    "「確定」「未決定」「提案」を区別する",
    "「やりたいこと」から必要な制作物・行動へ因果関係をつなぐ",
    "最終的には「この行動を完了すれば展示が成立する」という粒度まで分解する"
  ],

  // ここから18セクション本体
  sections: [

    // 1 ------------------------------------------------------
    {
      id: "s1", num: 1, icon: "🎯", title: "展覧会の目的・やりたいこと",
      stage: "vision", stageLabel: "STAGE① VISION",
      blocks: [
        {
          type: "statusList", key: "s1-yaritai",
          label: "一番やりたいこと（優先順位順）",
          items: [
            { text: "自分の作品・キャラクターを知ってもらいたい", status: "confirmed" },
            { text: "「この展示すごい」と思ってもらいたい", status: "confirmed" },
            { text: "自分自身が納得できる展示にしたい", status: "confirmed" },
            { text: "SNSや創作活動につなげたい", status: "confirmed" }
          ]
        },
        { type: "textarea", key: "s1-note", label: "その他の想い・補足（自由記入）", rows: 4 }
      ]
    },

    // 2 ------------------------------------------------------
    {
      id: "s2", num: 2, icon: "💡", title: "理想の展示像・コンセプト",
      stage: "concept", stageLabel: "STAGE② CONCEPT",
      blocks: [
        {
          type: "statusList", key: "s2-ideal", label: "理想の展示像",
          items: [
            { text: "キャラクター同士の関係性が伝わる展示にしたい", status: "confirmed" },
            { text: "一枚一枚を見るだけでなく、全体を見て一つの作品になるようにしたい", status: "confirmed" }
          ]
        },
        {
          type: "statusList", key: "s2-theme", label: "テーマ・コンセプト",
          items: [
            { text: "6人の関係性と課題が伝わるようにしたい", status: "confirmed" },
            { text: "大人と子供、強さと課題などの二面性", status: "confirmed" },
            { text: "モチーフ：人、花", status: "confirmed" }
          ]
        },
        {
          type: "statusList", key: "s2-group", label: "グループ展ならではの要素",
          items: [
            { text: "デジタルアナログ混合の空間のため、両方を取り入れた技法、展示方法にしたい", status: "confirmed" }
          ]
        }
      ]
    },

    // 3 ------------------------------------------------------
    {
      id: "s3", num: 3, icon: "👤", title: "来場者体験（カスタマージャーニー）",
      stage: "experience", stageLabel: "STAGE③ EXPERIENCE",
      blocks: [
        {
          type: "journey",
          steps: [
            { no: "01", title: "展示を見る前", desc: "この作品なんだろう／絵だけ見たことある相互の作品" },
            { no: "02", title: "見ている最中", desc: "こんな仕掛けあるんだ／世界観に没入" },
            { no: "03", title: "見終わった後", desc: "考えさせられた／もっとこのキャラについて知りたい → 作品を覚えて帰ってほしい" }
          ]
        }
      ]
    },

    // 4 ------------------------------------------------------
    {
      id: "s4", num: 4, icon: "🎁", title: "展示する「もの」",
      stage: "output", stageLabel: "STAGE⑦ OUTPUT",
      blocks: [
        {
          type: "statusList", key: "s4-items", label: "展示するもの",
          items: [
            { text: "イラスト（デジタル）", status: "confirmed" },
            { text: "キャラクター", status: "confirmed" },
            { text: "グッズ", status: "confirmed" }
          ]
        },
        {
          type: "statusList", key: "s4-method", label: "イラストの手法",
          items: [
            { text: "パネル？", status: "undecided" },
            { text: "クリアポスター？", status: "undecided" }
          ]
        },
        { type: "textarea", key: "s4-note", label: "その他（自由記入）", rows: 3 }
      ]
    },

    // 5 ------------------------------------------------------
    {
      id: "s5", num: 5, icon: "📦", title: "展示空間の方針",
      stage: "requirements", stageLabel: "STAGE④ REQUIREMENTS",
      blocks: [
        {
          type: "statusList", key: "s5-policy", label: "方針",
          items: [
            { text: "壁一面を使いたい", status: "confirmed" },
            { text: "立体的にしたい", status: "confirmed" },
            { text: "装飾を入れたい", status: "confirmed" },
            { text: "情報量が多いが整理され見やすい展示にしたい", status: "confirmed" }
          ]
        },
        { type: "textarea", key: "s5-good", label: "その他の希望・こだわり（自由記入）", rows: 3 },
        { type: "textarea", key: "s5-avoid", label: "やりたくないこと・避けたいこと（自由記入）", rows: 3 }
      ]
    },

    // 6 ------------------------------------------------------
    {
      id: "s6", num: 6, icon: "✏️", title: "表現・技法の方向性",
      stage: "expression", stageLabel: "STAGE⑥ EXPRESSION",
      blocks: [
        {
          type: "statusList", key: "s6-expr", label: "方向性",
          items: [
            { text: "デジタルとアナログの両方を取り入れる", status: "confirmed" },
            { text: "実物展示を利用して来場者を驚かせたい", status: "confirmed" },
            { text: "クリアポスターを重ねるなどの技法を使う", status: "confirmed" },
            { text: "箔押しを表紙だけ印刷で実現し、パネルに手張りなどで幅広い表現を行いたい", status: "confirmed" },
            { text: "販売を行うかは未定", status: "undecided" }
          ]
        },
        { type: "textarea", key: "s6-note", label: "その他の表現アイデア（自由記入）", rows: 4 }
      ]
    },

    // 7 ------------------------------------------------------
    {
      id: "s7", num: 7, icon: "👤", title: "ターゲット・想定来場者",
      stage: "experience", stageLabel: "STAGE③ EXPERIENCE",
      blocks: [
        {
          type: "statusList", key: "s7-target", label: "想定来場者",
          items: [
            { text: "1度目の展示を見に来た人", status: "confirmed" },
            { text: "または、私の創作を知らない、他の人目的の来場者かつイラストを見るのが好きな一般来場者", status: "confirmed" }
          ]
        },
        { type: "textarea", key: "s7-note", label: "その他の想定（自由記入）", rows: 3 }
      ]
    },

    // 8 ------------------------------------------------------
    {
      id: "s8", num: 8, icon: "💬", title: "展示で伝えたいこと・考えさせたいこと（メッセージ）",
      stage: "experience", stageLabel: "STAGE③ EXPERIENCE",
      blocks: [
        { type: "statusList", key: "s8-tell",  label: "伝えたいこと", items: [] },
        { type: "statusList", key: "s8-think", label: "考えさせたいこと", items: [] },
        { type: "statusList", key: "s8-keyword", label: "キーワード", items: [] }
      ],
      layout: "col3"
    },

    // 9 ------------------------------------------------------
    {
      id: "s9", num: 9, icon: "✨", title: "仕掛け・体験設計のアイデア",
      stage: "experience", stageLabel: "STAGE③ EXPERIENCE",
      sub: "未決定でもOK",
      blocks: [
        { type: "textarea", key: "s9-discover", label: "来場者に発見してほしいこと（自由記入）", rows: 4 },
        {
          type: "radioGroup", key: "s9-active", label: "来場者にどの程度能動的に見てほしいか",
          options: [
            { value: "1", label: "① 完全に受動的" },
            { value: "2", label: "② 少し能動的" },
            { value: "3", label: "③ かなり能動的" },
            { value: "4", label: "④ 未定" }
          ]
        }
      ]
    },

    // 10 -----------------------------------------------------
    {
      id: "s10", num: 10, icon: "📋", title: "展示構成の設計",
      stage: "design", stageLabel: "STAGE⑤ EXHIBITION DESIGN",
      sub: "未決定でもOK",
      blocks: [
        { type: "textarea", key: "s10-zoning", label: "全体の構成イメージ（ゾーニング・流れ・構成など自由に）", rows: 4 },
        {
          type: "checklist", key: "s10-show", label: "見せ方の要素（使いたいもの・手法）",
          items: [
            { text: "平面パネル", checked: false },
            { text: "クリア素材", checked: false },
            { text: "重ねる仕掛け", checked: false },
            { text: "立体物", checked: false },
            { text: "小物・装飾", checked: false },
            { text: "照明", checked: false },
            { text: "映像・デジタルコンテンツ", checked: false },
            { text: "テキスト・キャプション", checked: false }
          ]
        },
        {
          type: "statusList", key: "s10-info", label: "情報設計（見せたい情報の整理）",
          items: [
            { text: "キャラクター情報", status: "confirmed" },
            { text: "関係性", status: "confirmed" },
            { text: "世界観", status: "confirmed" },
            { text: "課題・二面性", status: "confirmed" },
            { text: "ストーリー", status: "confirmed" }
          ]
        }
      ],
      layout: "col2-last"
    },

    // 11 -----------------------------------------------------
    {
      id: "s11", num: 11, icon: "📄", title: "制作物リスト（仮）",
      stage: "output", stageLabel: "STAGE⑦ OUTPUT",
      sub: "未決定でも、思いつくものを書き出す",
      blocks: [
        {
          type: "table", key: "s11",
          columns: [
            { key: "item", label: "制作物" },
            { key: "role", label: "目的・役割" },
            { key: "qty",  label: "数量（目安）" },
            { key: "size", label: "仕様・サイズ（未定でもOK）" }
          ],
          minRows: 6
        }
      ]
    },

    // 12 -----------------------------------------------------
    {
      id: "s12", num: 12, icon: "📅", title: "行動計画ロードマップ",
      stage: "action", stageLabel: "STAGE⑧ ACTION",
      blocks: [
        {
          type: "roadmap",
          columns: [
            { key: "c1", title: "企画・設計", items: ["コンセプト整理", "構成設計", "必要な制作物の洗い出し", "スケジュール設計", "予算設計"] },
            { key: "c2", title: "制作準備", items: ["データ制作", "印刷手配", "素材・部材手配", "加工方法の検討", "試作・テスト"] },
            { key: "c3", title: "制作・加工", items: ["印刷・入稿", "加工・手作業", "組み立て・製作", "検品・確認"] },
            { key: "c4", title: "搬入準備", items: ["梱包・保護", "搬入物リスト作成", "設置手順の確認", "搬入スケジュール確認"] },
            { key: "c5", title: "会期中", items: ["在廊計画", "SNS発信計画", "来場者対応の準備"] },
            { key: "c6", title: "会期後", items: ["搬去・撤収", "在庫・残部確認", "SNSまとめ・発信", "次の活動への繋ぎ"] }
          ]
        }
      ]
    },

    // 13 -----------------------------------------------------
    {
      id: "s13", num: 13, icon: "🕐", title: "スケジュール（全体）",
      stage: "schedule", stageLabel: "STAGE⑨ SCHEDULE",
      blocks: [
        {
          type: "fieldGrid", columns: 2,
          fields: [
            { key: "s13-start", label: "制作開始予定", type: "date" },
            { key: "s13-movein", label: "搬入予定日", type: "date" },
            { key: "s13-period-start", label: "会期（開始）", type: "date" },
            { key: "s13-period-end", label: "会期（終了）", type: "date" },
            { key: "s13-teardown", label: "撤去予定日", type: "date" }
          ]
        },
        { type: "textarea", key: "s13-milestone", label: "逆算のマイルストーン（自由記入）", rows: 4 }
      ]
    },

    // 14 -----------------------------------------------------
    {
      id: "s14", num: 14, icon: "💰", title: "予算（目安）",
      stage: "supp", stageLabel: "実務管理",
      blocks: [
        { type: "fieldInline", key: "s14-total", label: "総予算：約", suffix: "円" },
        {
          type: "fieldGrid", columns: 3, label: "内訳（目安）",
          fields: [
            { key: "s14-print", label: "印刷費", type: "text" },
            { key: "s14-material", label: "素材・部材費", type: "text" },
            { key: "s14-process", label: "加工費", type: "text" },
            { key: "s14-transport", label: "輸送費", type: "text" },
            { key: "s14-otheramt", label: "その他", type: "text" }
          ]
        },
        { type: "textarea", key: "s14-othernote", label: "その他の内訳（自由記入）", rows: 2 }
      ]
    },

    // 15 -----------------------------------------------------
    {
      id: "s15", num: 15, icon: "⚠️", title: "リスク・課題と対策",
      stage: "supp", stageLabel: "実務管理",
      blocks: [
        {
          type: "table", key: "s15",
          columns: [
            { key: "issue", label: "リスク・課題" },
            { key: "action", label: "対策" }
          ],
          minRows: 5
        }
      ]
    },

    // 16 -----------------------------------------------------
    {
      id: "s16", num: 16, icon: "❓", title: "未決定事項・今後決めること",
      stage: "supp", stageLabel: "実務管理",
      blocks: [
        {
          type: "checklist", key: "s16-items", label: null,
          items: [
            { text: "", checked: false, placeholder: true }, { text: "", checked: false, placeholder: true },
            { text: "", checked: false, placeholder: true }, { text: "", checked: false, placeholder: true },
            { text: "", checked: false, placeholder: true }, { text: "", checked: false, placeholder: true }
          ]
        }
      ]
    },

    // 17 -----------------------------------------------------
    {
      id: "s17", num: 17, icon: "✅", title: "完成条件（Definition of Done）",
      stage: "check", stageLabel: "STAGE⑩ CHECK",
      sub: "この状態になったら「展示として完成」とする条件",
      blocks: [
        {
          type: "checklist", key: "s17-items", label: null, columns: 2,
          items: [
            { text: "展示物が全て揃っている", checked: false },
            { text: "自分が納得している", checked: false },
            { text: "設営が完了している", checked: false },
            { text: "来場者体験の流れが成立している", checked: false },
            { text: "", checked: false, placeholder: true }
          ]
        }
      ]
    },

    // 18 -----------------------------------------------------
    {
      id: "s18", num: 18, icon: "📈", title: "成功の指標（Goal）",
      stage: "check", stageLabel: "STAGE⑩ CHECK",
      sub: "展示の成功をどう測るか",
      blocks: [
        {
          type: "checklist", key: "s18-items", label: null, columns: 2,
          items: [
            { text: "来場者の反応（驚き・没入・考えた）", checked: false },
            { text: "作品を覚えて帰ってくれたか", checked: false, flag: "推定・要確認" },
            { text: "SNSでの反応・拡散", checked: false },
            { text: "自分の納得度", checked: false },
            { text: "", checked: false, unclear: true },
            { text: "", checked: false, placeholder: true }
          ]
        },
        { type: "statusList", key: "s18-goals", label: "具体的な指標・目標", items: [] }
      ]
    }

  ]
};
