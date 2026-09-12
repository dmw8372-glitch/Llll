import React, { useState } from 'react';
import { X } from 'lucide-react';

export type LegalDocType = 'TERMS' | 'COPYRIGHT' | 'PRIVACY';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
}

export const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'TERMS',
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);

  React.useEffect(() => {
    if (isOpen && initialDoc) {
      setActiveDoc(initialDoc);
    }
  }, [isOpen, initialDoc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60">
      <div className="bg-white text-neutral-900 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg border border-neutral-300 shadow-xl overflow-hidden">
        {/* Modal Top Header - Strictly Monochrome & Minimal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveDoc('TERMS')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeDoc === 'TERMS'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              이용안내 및 약관
            </button>
            <button
              type="button"
              onClick={() => setActiveDoc('COPYRIGHT')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeDoc === 'COPYRIGHT'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              저작권 및 공공데이터 이용정책
            </button>
            <button
              type="button"
              onClick={() => setActiveDoc('PRIVACY')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeDoc === 'PRIVACY'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              개인정보 처리방침
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Plain White Paper Document Style */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-neutral-900 leading-relaxed text-sm">
          {activeDoc === 'TERMS' && <TermsOfServiceDoc />}
          {activeDoc === 'COPYRIGHT' && <CopyrightPolicyDoc />}
          {activeDoc === 'PRIVACY' && <PrivacyPolicyDoc />}
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-600">
          <span>끝잇기 서비스 운영정책 문서</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded text-xs transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

/* Document 1: 서비스 이용안내 및 약관 */
const TermsOfServiceDoc: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b border-neutral-300 pb-4">
      <h1 className="text-xl font-bold text-neutral-900">끝잇기(Kkeutitgi) 서비스 이용약관 및 이용안내</h1>
      <p className="text-xs text-neutral-500 mt-1">시행일자: 2026년 1월 1일 | 최종 개정일자: 2026년 8월 28일</p>
    </div>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제1조 (목적)</h2>
      <p className="text-neutral-700">
        본 약관은 끝잇기(이하 &apos;서비스&apos;라 합니다)가 제공하는 온라인 한글 끝말잇기 대전 및 사전 검색 서비스의 이용조건 및 절차, 이용자와 서비스 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제2조 (용어의 정의)</h2>
      <p className="text-neutral-700">본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>&apos;서비스&apos;란 이용자가 단말기(PC, 모바일 등)를 통해 접속하여 실시간 끝말잇기 게임을 수행하고 국립국어원 표준국어대사전 표제어를 검색할 수 있는 웹 기반 플랫폼을 의미합니다.</li>
        <li>&apos;이용자&apos;란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 손님 및 회원을 의미합니다.</li>
        <li>&apos;방장(호스트)&apos;이란 대기실을 개설하고 게임 시작 및 방 설정을 주관하는 이용자를 의미합니다.</li>
        <li>&apos;표준 단어&apos;란 국립국어원 표준국어대사전 Open API를 통해 검증된 한글 표제어를 의미합니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제3조 (약관의 효력 및 변경)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>본 약관은 서비스 웹 화면에 게시함으로써 효력이 발생합니다.</li>
        <li>서비스는 관계 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있으며, 개정된 약관은 적용일자 7일 전부터 웹사이트 하단 및 공지사항을 통해 공지합니다.</li>
        <li>이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있으며, 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제4조 (게임 규칙의 준수 및 단어 판정)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>모든 참가자는 1턴당 5.0초의 제한 시간 내에 유효한 표준 단어를 입력하여야 합니다. 제한 시간을 초과할 경우 탈락 처리됩니다.</li>
        <li>단어는 두 글자 이상의 국립국어원 표준국어대사전 등재 표제어(명사, 대명사, 수사, 동사, 형용사 등)에 한하여 인정됩니다. 단, 방 설정에 따라 명사 전용 모드가 적용될 수 있습니다.</li>
        <li>동일 판 내에서 이미 사용된 단어는 재사용할 수 없으며, 중복 입력 시 무효 처리됩니다.</li>
        <li>한글 맞춤법 제10항, 제11항, 제12항에 따른 두음법칙(예: 녀→여, 뇨→요, 뉴→유, 니→이, 랴→야, 려→여, 례→예, 료→요, 류→유, 리→이, 라→나, 래→내, 로→노, 뢰→뇌, 루→누, 르→느 등)이 공식 허용됩니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제5조 (이용자의 의무 및 금지행위)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>이용자는 서비스 내 채팅 및 닉네임 설정 시 타인에게 모욕감을 주거나 음란, 폭력적, 비방성 표현을 사용하여서는 아니 됩니다.</li>
        <li>매크로, 자동 입력 프로그램, 부정 스크립트 등 비정상적인 수단을 사용하여 게임에 개입하거나 서버에 과도한 부하를 발생시키는 행위는 엄격히 금지됩니다.</li>
        <li>타인의 권리(지식재산권, 인격권 등)를 침해하거나 공공질서 및 미풍양속에 반하는 행위를 하여서는 아니 됩니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제6조 (서비스의 제공, 중단 및 면책조항)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 단, 시스템 정기 점검, 서버 교체, 국립국어원 Open API 서버 장애 등의 사유가 발생할 경우 일시적으로 중단될 수 있습니다.</li>
        <li>서비스는 천재지변, 국가 비상사태, 외부 Open API 장애 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
        <li>서비스는 무료로 제공되는 플랫폼으로서, 서비스 이용과 관련하여 이용자에게 발생한 어떠한 손해에 대해서도 책임을 지지 않습니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제7조 (분쟁의 해결 및 관할법원)</h2>
      <p className="text-neutral-700">
        서비스 이용과 관련하여 발생한 분쟁에 대해서는 대한민국 법령을 적용하며, 서비스 운영 주체의 소재지를 관할하는 법원을 전속 관할법원으로 합니다.
      </p>
    </section>
  </div>
);

/* Document 2: 저작권 및 공공데이터 이용정책 */
const CopyrightPolicyDoc: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b border-neutral-300 pb-4">
      <h1 className="text-xl font-bold text-neutral-900">저작권 및 공공데이터 이용정책</h1>
      <p className="text-xs text-neutral-500 mt-1">시행일자: 2026년 1월 1일 | 최종 개정일자: 2026년 8월 28일</p>
    </div>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제1조 (목적)</h2>
      <p className="text-neutral-700">
        본 정책은 끝잇기 서비스에서 활용하는 국립국어원 표준국어대사전 저작물 및 관련 데이터의 권리 관계, 공공데이터 이용 조건, 지식재산권 보호 기준을 명확히 함을 목적으로 합니다.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제2조 (국립국어원 표준국어대사전 공공누리 및 CCL 라이선스)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>본 서비스에서 제공하는 단어 정보, 품사, 어원, 뜻풀이 및 발음 데이터의 원저작권은 문화체육관광부 국립국어원에 있습니다.</li>
        <li>국립국어원 표준국어대사전 Open API 저작물은 &apos;공공누리 제2유형(출처표시+상업적 이용금지)&apos; 및 &apos;크리에이티브 커먼즈 저작자표시-동일조건변경허락 2.0 대한민국(CC BY-SA 2.0 KR)&apos; 조건에 따라 제공 및 이용됩니다.</li>
        <li>이용자는 본 서비스를 통해 열람한 사전 데이터를 개인적, 비상업적 학습 및 오락 목적으로만 이용할 수 있습니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제3조 (출처 표시의 의무)</h2>
      <p className="text-neutral-700">
        본 서비스는 공공저작물 관리 규정에 따라 국립국어원 표준국어대사전의 데이터를 인용 및 표기할 때 &apos;출처: 국립국어원 표준국어대사전 (stdict.korean.go.kr)&apos;을 명시하고 있으며, 이용자 역시 해당 데이터를 재배포하거나 2차 활용 시 반드시 출처를 표기하여야 합니다.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제4조 (서비스 소프트웨어의 지식재산권)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>끝잇기 서비스의 UI/UX 디자인, 웹 애플리케이션 소스코드, 게임 로직, 턴 관리 시스템 및 고유 그래픽 요소에 대한 저작권은 서비스 개발 및 운영 주체에 귀속됩니다.</li>
        <li>서비스의 허가 없이 전체 또는 일부 코드를 무단 복제, 분해, 역공학(Reverse Engineering)하거나 무단 상업 배포하는 행위를 금지합니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제5조 (배경음악 및 효과음 음원 라이선스 및 저작권 정책)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>본 서비스에서 재생되는 배경음악(BGM) 및 효과음(SFX)은 Web Audio API 기반 오리지널 실시간 신디사이저 알고리즘 합성음 및 완전 저작권 소멸 퍼블릭 도메인(Public Domain / CC0 1.0 Universal) 라이선스 기준을 준수하는 순수 무료·로열티 프리(Royalty-Free) 음원입니다.</li>
        <li>본 음원은 외부 저작권 침해 우려가 일체 없도록 서비스 자체 사운드 엔진으로 제작되었으며, 이용자는 개인 방송, 실시간 스트리밍(유튜브, 치지직, 트위치, 아프리카TV 등), 영상 녹화 및 게임 플레이 중 자유롭게 배경음악과 효과음을 청취 및 송출할 수 있습니다.</li>
        <li>음원 라이선스 출처: 끝잇기 내장 오리지널 Web Audio Sound Engine (CC0 1.0 Universal / Royalty-Free).</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h2 className="font-bold text-neutral-900">제6조 (권리 침해 신고 및 조치)</h2>
      <p className="text-neutral-700">
        서비스 내 콘텐츠가 타인의 저작권을 침해하는 경우, 권리자는 정당한 권리 증명 서류를 첨부하여 운영자에게 통보할 수 있으며, 서비스는 검토 후 즉시 해당 콘텐츠의 수정 또는 삭제 조치를 취합니다.
      </p>
    </section>
  </div>
);

/* Document 3: 개인정보 처리방침 (상세 개정판) */
const PrivacyPolicyDoc: React.FC = () => (
  <div className="space-y-6 text-sm text-neutral-800 leading-relaxed">
    <div className="border-b border-neutral-300 pb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-neutral-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
          공식 법적 고지
        </span>
        <span className="text-xs text-neutral-500 font-mono">Ver 2.4</span>
      </div>
      <h1 className="text-2xl font-black text-neutral-900 tracking-tight">개인정보 처리방침 (Privacy Policy)</h1>
      <p className="text-xs text-neutral-500 mt-1">
        공고일자: 2026년 9월 1일 | 시행일자: 2026년 9월 1일 | 최종 개정일자: 2026년 9월 12일
      </p>
    </div>

    <div className="p-4 bg-neutral-100/90 rounded-2xl border border-neutral-200 text-xs text-neutral-700 leading-normal">
      끝잇기(이하 &apos;서비스&apos;)는 대한민국 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 관계 법령을 준수하며, 이용자의 개인정보를 보호하고 이와 관련된 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 상세한 개인정보 처리방침을 수립·공개합니다. 본 방침은 웹 애플리케이션 및 모바일 웹 환경의 모든 서비스에 적용됩니다.
    </div>

    {/* 제1조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제1조 (총칙 및 개인정보의 처리 목적)</h2>
      <p>
        서비스는 다음의 목적을 위하여 필요 최소한의 개인정보를 수집 및 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 일체 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 정보주체로부터 별도의 사전 동의를 받는 등 필요한 법적 조치를 이행합니다.
      </p>
      <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-1">
        <li><strong>회원 가입 및 사용자 식별:</strong> Google OAuth 소셜 로그인 연동, 회원제 서비스 제공에 따른 본인 식별 및 인증, 중복 가입 방지, 계정 점유 확인.</li>
        <li><strong>게임 플레이 및 실시간 대전 운영:</strong> 1:1 및 다자간 실시간 끝말잇기 대기실 생성, 참여자 세션 매칭, 턴 동기화, 접속 끊김 처리.</li>
        <li><strong>경쟁 랭킹전 및 전적 시스템 관리:</strong> 공식 랭킹전 레이팅 점수(RP), 티어 등급(브론즈~정복자) 산출, 승패 전적 보존, 실시간 명예의 전당 순위표 게시.</li>
        <li><strong>부정 이용 방지 및 서비스 안정성 확보:</strong> 매크로, 인가되지 않은 외부 사전 크롤러, 턴 시간 조작 및 패킷 변조 방지, 비정상적 트래픽 모니터링, 서비스 무단 훼손 행위 제재.</li>
        <li><strong>이용자 지원 및 민원 응대:</strong> 버그 제보 처리, 계정 분실 및 복구 지원, 서비스 개선 및 이용 통계 분석.</li>
      </ul>
    </section>

    {/* 제2조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제2조 (처리하는 개인정보의 항목 및 수집 방법)</h2>
      <p>
        서비스는 회원가입(로그인) 시점 또는 서비스 이용 과정에서 정보주체의 동의하에 다음과 같은 항목의 개인정보를 수집합니다.
      </p>

      <div className="overflow-x-auto my-2 border border-neutral-300 rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-300">
            <tr>
              <th className="p-2.5 border-r border-neutral-300">구분</th>
              <th className="p-2.5 border-r border-neutral-300">수집 항목</th>
              <th className="p-2.5">수집 목적</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            <tr>
              <td className="p-2.5 font-bold bg-neutral-50/50 border-r border-neutral-200">구글 소셜 로그인 (필수)</td>
              <td className="p-2.5 border-r border-neutral-200">Google 고유 계정 식별자(UID), 구글 계정 이메일 주소, 기본 프로필 이미지 URL, 공개 닉네임</td>
              <td className="p-2.5">간편 로그인, 계정 식별, 클라우드 영구 전적 연동</td>
            </tr>
            <tr>
              <td className="p-2.5 font-bold bg-neutral-50/50 border-r border-neutral-200">대표 닉네임 (필수)</td>
              <td className="p-2.5 border-r border-neutral-200">사용자가 최초 로그인 후 직접 입력 확정한 고유 닉네임 (2~10자)</td>
              <td className="p-2.5">게임 대전 내 플레이어 표시, 랭킹 순위표 명예의 전당 등록</td>
            </tr>
            <tr>
              <td className="p-2.5 font-bold bg-neutral-50/50 border-r border-neutral-200">게임 전적 및 활동 데이터 (필수)</td>
              <td className="p-2.5 border-r border-neutral-200">랭킹전 점수(RP), 티어 등급, 총 경기수, 승패수, 연승 기록, 플레이어 레벨 및 경험치, 사용 단어 이력</td>
              <td className="p-2.5">실시간 티어 승급 체계 유지, 전적 집계, MMR 매칭</td>
            </tr>
            <tr>
              <td className="p-2.5 font-bold bg-neutral-50/50 border-r border-neutral-200">자동 생성 수집 항목</td>
              <td className="p-2.5 border-r border-neutral-200">IP 주소, 접속 로그, 서비스 이용 일시, 브라우저 종류 및 OS 정보, 기기 화면 해상도, 쿠키(Cookie), 로컬 세션 식별자</td>
              <td className="p-2.5">부정 접속 탐지, 네트워크 지연 최적화, 보안 감사</td>
            </tr>
            <tr>
              <td className="p-2.5 font-bold bg-neutral-50/50 border-r border-neutral-200">게스트(비로그인) 이용자</td>
              <td className="p-2.5 border-r border-neutral-200">임시 게스트 닉네임, 브라우저 세션 스토리지 식별자, 단말기 로컬 게임 기록</td>
              <td className="p-2.5">단말기 내 단기 게임 플레이 지원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-neutral-700">
        <strong>수집 금지 원칙:</strong> 본 서비스는 주민등록번호, 외국인등록번호, 여권번호 등 고유식별정보와 사상·신념, 건강 및 금융계좌번호, 신용카드번호 등의 민감정보를 일절 수집하거나 요구하지 않습니다.
      </p>
    </section>

    {/* 제3조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제3조 (개인정보의 보유 및 이용 기간)</h2>
      <ol className="list-decimal list-inside space-y-1.5 text-neutral-700 pl-1">
        <li>
          <strong>회원 개인정보:</strong> 이용자가 회원 가입을 유지하는 기간 동안 지속적으로 보유 및 이용되며, 이용자가 회원 탈퇴를 요청하거나 계정 삭제를 신청하는 경우 지체 없이 파기합니다.
        </li>
        <li>
          <strong>비로그인 게스트 데이터:</strong> 이용자가 웹 브라우저를 종료하거나 캐시 및 로컬 스토리지를 초기화하는 즉시 단말기에서 소멸되며, 서버 데이터베이스에는 영구 저장되지 않습니다.
        </li>
        <li>
          <strong>실시간 멀티플레이어 세션 데이터:</strong> 대기실 채팅 및 게임 진행 중 발생한 임시 통신 데이터는 게임 방이 종료되거나 참가자가 퇴장하는 즉시 서버 메모리에서 완전 소멸됩니다.
        </li>
        <li>
          <strong>관계 법령에 의한 보존:</strong> 관계 법령의 규정에 의하여 보존할 필요가 있는 경우, 서비스는 아래와 같이 명시된 기간 동안 해당 정보를 안전하게 별도 보관합니다.
          <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-xs text-neutral-600">
            <li>통신비밀보호법에 따른 웹사이트 방문 기록 및 접속 로그: 3개월</li>
            <li>전자상거래 등에서의 소비자보호에 관한 법률에 따른 불만 또는 분쟁처리에 관한 기록: 3년</li>
            <li>부정 이용 방지 및 분쟁 조정을 위해 필요한 내부 기록: 탈퇴 후 6개월</li>
          </ul>
        </li>
      </ol>
    </section>

    {/* 제4조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제4조 (개인정보의 파기 절차 및 파기 방법)</h2>
      <p>
        서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 안전하게 파기합니다.
      </p>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>
          <strong>파기 절차:</strong> 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인 하에 데이터베이스에서 즉시 삭제 처리를 진행합니다.
        </li>
        <li>
          <strong>전자적 파일 형태:</strong> 데이터베이스(Firestore) 및 캐시 저장소에 저장된 전자적 파일 형태의 정보는 복구 및 재생이 불가능한 기술적 방법(데이터베이스 로우 삭제 및 암호화 키 폐기)을 사용하여 영구히 삭제합니다.
        </li>
      </ol>
    </section>

    {/* 제5조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제5조 (개인정보의 제3자 제공)</h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
        <li>서비스는 이용자의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.</li>
        <li>단, 법률의 특별한 규정이 있거나 법원 및 수사기관의 적법한 영장 또는 법정 절차에 따른 요청이 있는 경우에는 예외로 합니다.</li>
      </ol>
    </section>

    {/* 제6조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제6조 (개인정보 처리 업무의 위탁 및 국외 이전)</h2>
      <p>
        서비스는 원활한 클라우드 인프라 제공 및 안정적인 실시간 네트워크 통신을 위하여 다음과 같이 전문 클라우드 서비스 제공 업체에 개인정보 처리 업무를 위탁 및 국외 이전하고 있습니다.
      </p>
      <div className="overflow-x-auto my-2 border border-neutral-300 rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-300">
            <tr>
              <th className="p-2 border-r border-neutral-300">수탁 업체</th>
              <th className="p-2 border-r border-neutral-300">위탁 업무 내용</th>
              <th className="p-2 border-r border-neutral-300">이전 국가 및 시점</th>
              <th className="p-2">보호 조치</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            <tr>
              <td className="p-2 font-bold border-r border-neutral-200">Google LLC (Google Cloud / Firebase)</td>
              <td className="p-2 border-r border-neutral-200">사용자 계정 인증(Firebase Auth), 사용자 프로필 및 랭킹 데이터 클라우드 저장(Firestore), 호스팅 인프라 제공</td>
              <td className="p-2 border-r border-neutral-200">미국 및 글로벌 리전 (서비스 이용 시 네트워크 전송)</td>
              <td className="p-2">ISO 27001/SOC2 인증 준수, 데이터 보관 및 전송 전 구간 SSL/TLS 암호화</td>
            </tr>
            <tr>
              <td className="p-2 font-bold border-r border-neutral-200">Supabase Inc.</td>
              <td className="p-2 border-r border-neutral-200">웹소켓(WebSocket) 기반 실시간 멀티플레이어 룸 동기화, 플레이어 상태 브로드캐스트</td>
              <td className="p-2 border-r border-neutral-200">미국 및 AWS 글로벌 리전 (실시간 접속 시)</td>
              <td className="p-2">TLS 종단간 암호화 세션, 휘발성 메모리 채널 운영 후 즉시 휘발</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    {/* 제7조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제7조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h2>
      <ol className="list-decimal list-inside space-y-1.5 text-neutral-700 pl-1">
        <li>
          이용자는 언제든지 등록되어 있는 자신의 개인정보를 열람하거나 계정 로그아웃, 회원 탈퇴를 요청할 수 있습니다.
        </li>
        <li>
          이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용하지 않습니다.
        </li>
        <li>
          만 14세 미만 아동의 경우 법정대리인이 아동의 개인정보에 대한 열람, 정정, 삭제, 처리정지 요구권을 행사할 수 있습니다.
        </li>
        <li>
          권리 행사는 웹사이트 내 문의 창구 또는 이메일을 통해 접수하실 수 있으며, 서비스는 이에 대해 지체 없이 필요한 조치를 취하고 결과를 통지합니다.
        </li>
      </ol>
    </section>

    {/* 제8조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제8조 (개인정보의 안전성 확보 조치)</h2>
      <p>
        서비스는 이용자의 소중한 개인정보가 분실, 도난, 유출, 위조·변조 또는 훼손되지 않도록 「개인정보 보호법」 제29조에 따라 다음과 같은 고도의 기술적·관리적·물리적 보호 조치를 엄격히 강구하고 있습니다.
      </p>
      <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-1">
        <li><strong>전송 구간 암호화 (SSL/TLS):</strong> 웹 브라우저와 클라우드 서버 간의 모든 HTTP 통신 및 실시간 웹소켓 패킷은 전송 계층 보안 프로토콜(TLS 1.3 / HTTPS)을 적용하여 철저히 암호화 전송됩니다.</li>
        <li><strong>데이터베이스 접근 통제 (Firestore Security Rules):</strong> 서버 측 보안 규칙을 적용하여 오직 본인으로 인증된 클라이언트만이 본인의 프로필 데이터를 읽고 쓸 수 있도록 철저한 접근 권한(RBAC)을 강제합니다.</li>
        <li><strong>해시화 및 비밀번호 미보관:</strong> 소셜 로그인(OAuth 2.0) 방식을 채택하여 사용자의 계정 비밀번호는 서비스 서버에 저장되지 않으며, Google의 글로벌 보안 인프라를 통해서만 인증 토큰이 안전하게 검증됩니다.</li>
        <li><strong>취약점 모니터링:</strong> 비인가 접근 탐지 및 XSS(크로스 사이트 스크립팅), CSRF, 인젝션 공격에 대비한 철저한 입력값 검증 루틴을 구현하고 있습니다.</li>
      </ul>
    </section>

    {/* 제9조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
      <ol className="list-decimal list-inside space-y-1.5 text-neutral-700 pl-1">
        <li>
          <strong>로컬 스토리지(LocalStorage) 및 쿠키의 운용:</strong> 본 서비스는 빠른 화면 로딩, 음향 볼륨 및 배경음악 설정 저장, 최근 플레이어 기록, 다크/라이트 테마 등 이용자 맞춤형 환경을 제공하기 위해 브라우저의 저장소(LocalStorage) 및 쿠키를 활용합니다.
        </li>
        <li>
          <strong>쿠키 및 로컬 저장소 설치 거부 방법:</strong> 이용자는 웹 브라우저 설정을 통해 쿠키 허용 여부를 지정하거나 모든 쿠키 및 사이트 데이터를 삭제할 수 있습니다.
          <p className="text-xs text-neutral-500 mt-0.5">
            ※ 설정 예시: Chrome 브라우저 &gt; 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷 사용 기록 삭제 또는 사이트 설정 &gt; 쿠키 및 사이트 데이터
          </p>
        </li>
      </ol>
    </section>

    {/* 제10조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제10조 (개인정보 보호책임자 및 고충처리 부서)</h2>
      <p>
        서비스는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
      </p>
      <div className="p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl space-y-1 text-xs">
        <div><strong>개인정보 보호책임 부서:</strong> 끝잇기 운영지원 및 정보보호팀</div>
        <div><strong>연락처 및 이메일:</strong> privacy@kkeutitgi.game (또는 서비스 내 공식 고객지원 창구)</div>
        <div><strong>근무 시간:</strong> 평일 10:00 ~ 18:00 (주말 및 공휴일 휴무)</div>
      </div>
      <p className="text-xs text-neutral-600">
        기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 공공기관에 문의하시기 바랍니다:
      </p>
      <ul className="list-disc list-inside text-xs text-neutral-600 pl-2 space-y-0.5">
        <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
        <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
        <li>대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)</li>
        <li>경찰청 사이버수사국: (국번없이) 182 (ecrm.police.go.kr)</li>
      </ul>
    </section>

    {/* 제11조 */}
    <section className="space-y-2">
      <h2 className="text-base font-black text-neutral-900">제11조 (개인정보 처리방침의 변경 및 고지의무)</h2>
      <p className="text-neutral-700">
        본 개인정보 처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용이 추가, 삭제 및 수정될 수 있습니다. 개인정보 처리방침을 개정하는 경우 서비스 공지사항 또는 모달 안내 팝업을 통하여 시행 7일 전부터 사전 공지할 것입니다.
      </p>
      <p className="text-xs text-neutral-500 font-semibold mt-2">
        본 방침은 2026년 9월 12일부터 효력이 발생합니다.
      </p>
    </section>
  </div>
);
