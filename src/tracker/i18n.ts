import type { LangKey, RangeKey, RegionCode, SectorKey } from './data'

export interface UiStrings {
  kicker: string
  title: string
  sub: string
  inflow: string
  outflow: string
  rotated: string
  soldDown: string
  boughtInto: string
  selected: string
  auto: string
  clear: string
  netOver: string
  cumFlow: string
  sectorBreak: string
  induBreak: string
  counterparties: string
  topNames: string
  from: string
  to: string
  tickerTitle: string
  tickerSub: string
  bought: string
  sold: string
  matrixTitle: string
  matrixSub: string
  narrTitle: string
  narrSub: string
  momTitle: string
  momSub: string
  momSub2: string
  ofFlow: string
  footer: string
  noCov: string
  gold: string
  asOf: string
  asOfShort: string
  tabs: [string, string, string]
  metrics: [string, string, string]
  hints: [string, string, string]
}

export interface Locale {
  /**
   * True for languages where a directional word follows its noun
   * ("Japan から" rather than "from Japan").
   */
  suffix?: boolean
  reg: Record<RegionCode, string>
  sec: Record<SectorKey, string>
  sshort: Record<SectorKey, string>
  indu: Record<SectorKey, string[]>
  rlab: Record<RangeKey, string>
  ui: UiStrings
}

export const LOCALES: Record<LangKey, Locale> = {
  en: {
    reg: { US: 'United States', EU: 'Europe', JP: 'Japan', KR: 'Korea', TW: 'Taiwan', HK: 'Hong Kong', SG: 'Singapore' },
    sec: {
      SEMI: 'Semiconductors',
      TECH: 'Tech & Internet',
      FIN: 'Financials',
      IND: 'Industrials',
      HLTH: 'Healthcare',
      ENE: 'Energy',
      CON: 'Consumer',
      MAT: 'Materials',
      PROP: 'Property',
    },
    sshort: {
      SEMI: 'Semi',
      TECH: 'Tech',
      FIN: 'Fin',
      IND: 'Ind',
      HLTH: 'Hlth',
      ENE: 'Enrg',
      CON: 'Cons',
      MAT: 'Mat',
      PROP: 'Prop',
    },
    indu: {
      SEMI: ['Foundry', 'Memory', 'Equipment', 'Fabless'],
      TECH: ['Platforms', 'Software', 'E-commerce', 'Gaming'],
      FIN: ['Banks', 'Insurers', 'Brokers'],
      IND: ['Automation', 'Autos', 'Capital goods'],
      HLTH: ['Pharma', 'Devices', 'Biotech'],
      ENE: ['Integrated', 'Refiners', 'Renewables'],
      CON: ['Staples', 'Discretionary', 'Retail'],
      MAT: ['Chemicals', 'Steel', 'Mining'],
      PROP: ['Developers', 'REITs'],
    },
    rlab: { '1D': '1 day', '5D': '5 days', '15D': '15 days', '30D': '30 days' },
    ui: {
      kicker: 'Cross-border equity flows',
      title: 'Where the hot money went',
      sub: 'Net institutional + ETF flow across US · EU · JP · KR · TW · HK · SG —',
      inflow: 'inflow',
      outflow: 'outflow',
      rotated: 'rotated',
      soldDown: 'SOLD DOWN',
      boughtInto: 'BOUGHT INTO',
      selected: 'Selected',
      auto: 'auto · largest inflow bucket',
      clear: 'clear',
      netOver: 'net over',
      cumFlow: 'cumulative flow · 30d',
      sectorBreak: 'Sector breakdown',
      induBreak: 'Industry breakdown',
      counterparties: 'Counterparties',
      topNames: 'Top names in bucket',
      from: 'from',
      to: 'to',
      tickerTitle: 'Ticker-level extremes',
      tickerSub: 'Largest single-name net flow,',
      bought: 'Bought',
      sold: 'Sold',
      matrixTitle: 'Region rotation matrix',
      matrixSub: 'Row sold → column bought, $B',
      narrTitle: "What's driving it",
      narrSub: 'Plain-language read on the biggest moves',
      momTitle: 'Sector momentum, all markets',
      momSub: 'cumulative net flow path over',
      momSub2: '· click to focus',
      ofFlow: '% of flow',
      footer: 'Prototype · synthetic flow data for design review, not investment information',
      noCov: 'no coverage in prototype',
      gold: 'Gold',
      asOf: '3 Aug 2026 · 17:00 HKT',
      asOfShort: '3 Aug',
      tabs: ['Flow ribbons', 'Region × sector grid', 'Rotation ring'],
      metrics: ['Institutional', 'ETF', 'Combined'],
      hints: [
        'Each ribbon is capital leaving one market·sector bucket and arriving in another. Click a bar to focus its flows, click it again to clear.',
        'Net flow per market and sector in $B — deep teal is accumulation, deep rust is distribution. Click a cell to drill into industries.',
        'Market-to-market rotation only. Bubble size is net position change; ribbon thickness is gross flow between the pair.',
      ],
    },
  },

  zh: {
    reg: { US: '美国', EU: '欧洲', JP: '日本', KR: '韩国', TW: '台湾', HK: '香港', SG: '新加坡' },
    sec: {
      SEMI: '半导体',
      TECH: '科技与互联网',
      FIN: '金融',
      IND: '工业',
      HLTH: '医疗健康',
      ENE: '能源',
      CON: '消费',
      MAT: '材料',
      PROP: '地产',
    },
    sshort: {
      SEMI: '半导',
      TECH: '科技',
      FIN: '金融',
      IND: '工业',
      HLTH: '医疗',
      ENE: '能源',
      CON: '消费',
      MAT: '材料',
      PROP: '地产',
    },
    indu: {
      SEMI: ['代工', '存储', '设备', '无晶圆'],
      TECH: ['平台', '软件', '电商', '游戏'],
      FIN: ['银行', '保险', '券商'],
      IND: ['自动化', '汽车', '资本品'],
      HLTH: ['制药', '器械', '生物科技'],
      ENE: ['综合', '炼化', '新能源'],
      CON: ['必需消费', '可选消费', '零售'],
      MAT: ['化工', '钢铁', '矿业'],
      PROP: ['开发商', 'REITs'],
    },
    rlab: { '1D': '1天', '5D': '5天', '15D': '15天', '30D': '30天' },
    ui: {
      kicker: '跨境股票资金流',
      title: '热钱去了哪里',
      sub: '美国 · 欧洲 · 日本 · 韩国 · 台湾 · 香港 · 新加坡的机构与ETF净流向 —',
      inflow: '流入',
      outflow: '流出',
      rotated: '资金轮动',
      soldDown: '减仓方',
      boughtInto: '加仓方',
      selected: '已选',
      auto: '自动 · 最大流入板块',
      clear: '清除',
      netOver: '净流向 ·',
      cumFlow: '累计资金流 · 30天',
      sectorBreak: '行业拆分',
      induBreak: '子行业拆分',
      counterparties: '对手方',
      topNames: '板块内主要个股',
      from: '来自',
      to: '流向',
      tickerTitle: '个股极值',
      tickerSub: '单一个股最大净流向,',
      bought: '买入',
      sold: '卖出',
      matrixTitle: '区域轮动矩阵',
      matrixSub: '行卖出 → 列买入,十亿美元',
      narrTitle: '背后的原因',
      narrSub: '用平实语言解读最大的变动',
      momTitle: '各市场行业动能',
      momSub: '累计净流向路径 ·',
      momSub2: '· 点击聚焦',
      ofFlow: '% 占总流量',
      footer: '原型 · 合成数据仅供设计评审,非投资信息',
      noCov: '原型中暂无覆盖',
      gold: '黄金',
      asOf: '2026年8月3日 · 17:00 香港时间',
      asOfShort: '8月3日',
      tabs: ['资金流带', '区域 × 行业热力图', '轮动环'],
      metrics: ['机构', 'ETF', '合计'],
      hints: [
        '每条流带代表资金从一个市场·行业流向另一个。点击色条聚焦,再次点击取消。',
        '按市场与行业的净流向(十亿美元)—— 深青为吸筹,深锈为派发。点击单元格查看子行业。',
        '仅显示市场之间的轮动。气泡大小为净变动,流带粗细为该对之间的总流量。',
      ],
    },
  },

  ja: {
    suffix: true,
    reg: { US: '米国', EU: '欧州', JP: '日本', KR: '韓国', TW: '台湾', HK: '香港', SG: 'シンガポール' },
    sec: {
      SEMI: '半導体',
      TECH: 'テック・ネット',
      FIN: '金融',
      IND: '資本財',
      HLTH: 'ヘルスケア',
      ENE: 'エネルギー',
      CON: '消費',
      MAT: '素材',
      PROP: '不動産',
    },
    sshort: {
      SEMI: '半導',
      TECH: 'テック',
      FIN: '金融',
      IND: '資本',
      HLTH: '医療',
      ENE: 'エネ',
      CON: '消費',
      MAT: '素材',
      PROP: '不動',
    },
    indu: {
      SEMI: ['ファウンドリ', 'メモリ', '製造装置', 'ファブレス'],
      TECH: ['プラットフォーム', 'ソフト', 'EC', 'ゲーム'],
      FIN: ['銀行', '保険', '証券'],
      IND: ['自動化', '自動車', '資本財'],
      HLTH: ['製薬', '医療機器', 'バイオ'],
      ENE: ['統合', '精製', '再エネ'],
      CON: ['生活必需', '一般消費', '小売'],
      MAT: ['化学', '鉄鋼', '鉱業'],
      PROP: ['デベロッパー', 'REIT'],
    },
    rlab: { '1D': '1日', '5D': '5日', '15D': '15日', '30D': '30日' },
    ui: {
      kicker: 'クロスボーダー株式資金フロー',
      title: 'ホットマネーの行き先',
      sub: '米国 · 欧州 · 日本 · 韓国 · 台湾 · 香港 · シンガポールの機関投資家＋ETF純フロー —',
      inflow: '流入',
      outflow: '流出',
      rotated: 'が移動',
      soldDown: '売られた側',
      boughtInto: '買われた側',
      selected: '選択中',
      auto: '自動 · 最大流入バケット',
      clear: '解除',
      netOver: '期間',
      cumFlow: '累積フロー · 30日',
      sectorBreak: 'セクター内訳',
      induBreak: '業種内訳',
      counterparties: '相手先',
      topNames: '主要銘柄',
      from: 'から',
      to: 'へ',
      tickerTitle: '個別銘柄の極値',
      tickerSub: '単一銘柄の最大純フロー,',
      bought: '買い',
      sold: '売り',
      matrixTitle: '地域ローテーション行列',
      matrixSub: '行=売り → 列=買い(十億ドル)',
      narrTitle: '背景',
      narrSub: '大きな動きをわかりやすく',
      momTitle: '全市場セクターモメンタム',
      momSub: '累積純フロー推移 ·',
      momSub2: '· クリックで絞り込み',
      ofFlow: '% (全体比)',
      footer: 'プロトタイプ · デザイン検証用の合成データ、投資情報ではありません',
      noCov: 'このプロトタイプでは未収録',
      gold: '金',
      asOf: '2026年8月3日 · 17:00 HKT',
      asOfShort: '8月3日',
      tabs: ['フローリボン', '地域 × セクター', 'ローテーション環'],
      metrics: ['機関投資家', 'ETF', '合計'],
      hints: [
        '各リボンは、ある市場·セクターから別の市場·セクターへ移った資金です。バーをクリックで絞り込み、再クリックで解除。',
        '市場×セクター別の純フロー(十億ドル)。濃いティールは買い集め、濃い錆色は放出。セルをクリックで業種へドリルダウン。',
        '市場間のローテーションのみ。バブルの大きさは純変化、リボンの太さはペア間の総フロー。',
      ],
    },
  },

  ko: {
    suffix: true,
    reg: { US: '미국', EU: '유럽', JP: '일본', KR: '한국', TW: '타이완', HK: '홍콩', SG: '싱가포르' },
    sec: {
      SEMI: '반도체',
      TECH: '테크·인터넷',
      FIN: '금융',
      IND: '산업재',
      HLTH: '헬스케어',
      ENE: '에너지',
      CON: '소비재',
      MAT: '소재',
      PROP: '부동산',
    },
    sshort: {
      SEMI: '반도체',
      TECH: '테크',
      FIN: '금융',
      IND: '산업',
      HLTH: '헬스',
      ENE: '에너지',
      CON: '소비',
      MAT: '소재',
      PROP: '부동산',
    },
    indu: {
      SEMI: ['파운드리', '메모리', '장비', '팹리스'],
      TECH: ['플랫폼', '소프트웨어', '이커머스', '게임'],
      FIN: ['은행', '보험', '증권'],
      IND: ['자동화', '자동차', '자본재'],
      HLTH: ['제약', '의료기기', '바이오'],
      ENE: ['종합', '정제', '신재생'],
      CON: ['필수소비', '경기소비', '유통'],
      MAT: ['화학', '철강', '광업'],
      PROP: ['디벨로퍼', '리츠'],
    },
    rlab: { '1D': '1일', '5D': '5일', '15D': '15일', '30D': '30일' },
    ui: {
      kicker: '국가 간 주식 자금 흐름',
      title: '핫머니는 어디로 갔나',
      sub: '미국 · 유럽 · 일본 · 한국 · 타이완 · 홍콩 · 싱가포르 기관 + ETF 순유입 —',
      inflow: '유입',
      outflow: '유출',
      rotated: '이동',
      soldDown: '매도된 쪽',
      boughtInto: '매수된 쪽',
      selected: '선택',
      auto: '자동 · 최대 유입 버킷',
      clear: '해제',
      netOver: '기간',
      cumFlow: '누적 자금 흐름 · 30일',
      sectorBreak: '섹터 분해',
      induBreak: '업종 분해',
      counterparties: '상대방',
      topNames: '주요 종목',
      from: '에서',
      to: '으로',
      tickerTitle: '종목별 극단치',
      tickerSub: '개별 종목 최대 순유입,',
      bought: '매수',
      sold: '매도',
      matrixTitle: '지역 로테이션 매트릭스',
      matrixSub: '행 매도 → 열 매수, 십억 달러',
      narrTitle: '무엇이 움직였나',
      narrSub: '큰 흐름을 쉬운 말로',
      momTitle: '전 시장 섹터 모멘텀',
      momSub: '누적 순유입 경로 ·',
      momSub2: '· 클릭하여 집중',
      ofFlow: '% 비중',
      footer: '프로토타입 · 디자인 검토용 합성 데이터, 투자 정보 아님',
      noCov: '프로토타입 미포함',
      gold: '금',
      asOf: '2026년 8월 3일 · 17:00 HKT',
      asOfShort: '8월 3일',
      tabs: ['플로우 리본', '지역 × 섹터 그리드', '로테이션 링'],
      metrics: ['기관', 'ETF', '합계'],
      hints: [
        '각 리본은 한 시장·섹터에서 다른 시장·섹터로 이동한 자금입니다. 바를 클릭해 집중하고, 다시 클릭하면 해제됩니다.',
        '시장·섹터별 순유입(십억 달러) — 진한 청록은 매집, 진한 적갈색은 분산. 셀을 클릭하면 업종으로 드릴다운.',
        '시장 간 로테이션만 표시. 버블 크기는 순변화, 리본 두께는 해당 쌍의 총 흐름.',
      ],
    },
  },
}

/**
 * Translated narrative bodies, indexed positionally against `BASE_EDGES`.
 * English lives on the edge itself.
 */
export const WHY: Partial<Record<LangKey, string[]>> = {
  zh: [
    '外资在韩国存储芯片连涨半年后减仓,资金转入估值更低、南向资金支持的香港平台股。',
    '美国大型软件股获利了结,资金轮动至日本自动化与资本品,日元偏弱与回购计划形成助力。',
    '台湾晶圆代工在强势中被降低权重,资金沿AI产业链回流美国云端巨头。',
    '降息预期升温,欧洲银行多头减仓,日本大型银行成为仅剩的利率正常化交易。',
    '油价疲弱使通用型基金撤出美国综合能源,转向受益电网与国防支出的欧洲工业股。',
    '融资成本压力下新加坡REITs遭减持,随着HIBOR回落资金流入香港金融股。',
    '同一市场内的轮动:地产依旧受冷,同一批投资者因盈利上调加仓香港互联网。',
    '工资周期不确定性下日本消费股被卖出,资金转入盈利更具防御性的美国医疗。',
    '中国需求担忧使奢侈品仓位减少,具防御性的美国零售承接了资金。',
    '韩国电池链消费股卖出,资金补仓台湾先进封装。',
    '基于估值的置换:卖出美国制药,买入欧洲大型药企与减重药产业链。',
    '新加坡银行创纪录派息后获利了结,资金跟随日本重估主题。',
    '小幅逆向流动:硬件组装厂被卖出,韩国芯片股在回调中被部分买回。',
    '大宗周期股换入欧洲能源,看重股息与回购支撑。',
  ],
  ja: [
    '半年の上昇を経て韓国メモリを外国勢が削減し、バリュエーションの低い香港プラットフォーム株へ資金を振り向けた。',
    '米大型ソフトの利益確定が、円安と自社株買いを背景に日本の自動化・資本財へのローテーション資金となった。',
    '台湾ファウンドリの比重を強含みで削減し、資金はAIスタックを遡って米ハイパースケーラーへ戻った。',
    '利下げ観測が固まり欧州銀行のロングを縮小、金利正常化トレードとして日本のメガバンクを買い。',
    '原油の軟化で米統合石油から資金が抜け、送電網と防衛関連の欧州資本財へ向かった。',
    '資金調達コストでシンガポールREITを削減、HIBOR低下に伴い香港金融へ着地。',
    '同一市場内のローテーション。ディベロッパーは不人気のまま、同じ投資家が業績上方修正の香港ネット株を買い増し。',
    '賃金サイクルの不透明感で日本の消費株を売却し、ディフェンシブな米ヘルスケアへ。',
    '中国需要への懸念でラグジュアリーを削減、ディフェンシブな米小売が資金を受けた。',
    '韓国の電池関連消費株を売り、台湾の先端パッケージングを買い増し。',
    'バリュエーション主導で米製薬から欧州大型製薬・肥満症関連へ入れ替え。',
    '記録的増配後にシンガポール銀行を利益確定、資金は日本の再評価テーマへ。',
    '小さな逆流。ハードウェア組立を売り、押し目の韓国半導体を一部買い戻し。',
    '素材シクリカルを欧州エネルギーへ入れ替え、配当と自社株買いを重視。',
  ],
  ko: [
    '반년 급등 후 외국인이 한국 메모리를 줄이고, 밸류에이션이 낮고 남향자금이 유입되는 홍콩 플랫폼주로 자금을 옮겼다.',
    '미국 대형 소프트웨어 차익실현이 엔 약세와 자사주 매입을 배경으로 일본 자동화·자본재 로테이션 자금이 됐다.',
    '강세 구간에서 타이완 파운드리 비중을 줄이고, 자금은 AI 밸류체인을 거슬러 미국 하이퍼스케일러로 돌아갔다.',
    '금리 인하 기대가 굳어지며 유럽 은행 롱을 축소, 남은 금리 정상화 트레이드로 일본 메가뱅크를 매수.',
    '유가 약세로 미국 종합 에너지에서 자금이 빠져 전력망·방산 수요의 유럽 산업재로 이동.',
    '조달 비용 부담에 싱가포르 리츠를 축소, HIBOR 하락과 함께 홍콩 금융으로 유입.',
    '같은 시장 내 로테이션: 디벨로퍼는 여전히 외면받고, 같은 투자자가 실적이 상향된 홍콩 인터넷을 늘렸다.',
    '임금 사이클 불확실성에 일본 소비주를 매도하고 방어적 이익의 미국 헬스케어로 이동.',
    '중국 수요 우려로 명품 비중을 줄이고 방어적인 미국 소매가 자금을 받았다.',
    '한국 배터리 체인 소비주를 팔아 타이완 선단 패키징을 추가 매수.',
    '밸류에이션에 따른 교체: 미국 제약을 팔고 유럽 대형 제약·비만 밸류체인 매수.',
    '사상 최대 배당 이후 싱가포르 은행 차익실현, 자금은 일본 리레이팅 테마로.',
    '소규모 역방향 흐름: 하드웨어 조립을 매도하고 조정받은 한국 반도체를 일부 재매수.',
    '소재 경기민감주를 배당과 자사주 매입이 뒷받침되는 유럽 에너지로 교체.',
  ],
}
