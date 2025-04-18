import React, { useEffect, useRef, useState } from "react";
import "kekule";
import "kekule/theme/default";
import OCL from "openchemlib";

// Kekule.js 라이브러리가 로드될 때까지 기다리는 헬퍼 함수 (선택 사항)
const ensureKekuleLoaded = () => {
  return new Promise((resolve) => {
    const checkKekule = () => {
      if (window.Kekule) {
        resolve(window.Kekule);
      } else {
        setTimeout(checkKekule, 100); // 100ms 간격으로 확인
      }
    };
    checkKekule();
  });
};

function KekuleViewer({
  chemObj,
  formula = "",
  className = "chem-viewer",
  width = "100%",
  height = "400px",
  format = "smi",
}) {
  const containerRef = useRef(null); // Kekule 뷰어가 렌더링될 DOM 요소를 참조
  const viewerRef = useRef(null); // Kekule 뷰어 인스턴스를 저장
  const [isKekuleReady, setIsKekuleReady] = useState(false);

  // Kekule.js 라이브러리 로드 확인
  useEffect(() => {
    ensureKekuleLoaded().then(() => {
      setIsKekuleReady(true);
      console.log("Kekule.js is ready.");
    });
  }, []);

  // Kekule 뷰어 초기화 및 업데이트
  useEffect(() => {
    // Kekule.js가 준비되고, DOM 요소가 준비되었을 때만 실행
    if (isKekuleReady && containerRef.current) {
      const Kekule = window.Kekule; // 전역 Kekule 객체 사용

      // 뷰어 인스턴스가 없으면 새로 생성
      if (!viewerRef.current) {
        console.log("Creating Kekule Viewer instance...");
        const viewer = new Kekule.ChemWidget.Viewer(document); // 또는 Kekule.ChemWidget.ChemViewer
        viewer.setEnableToolbar(true); // 툴바 활성화 (옵션)
        viewer.setEnableEdit(false); // 편집 비활성화 (뷰어 목적)
        viewer.setRenderType(Kekule.Render.RendererType.R2D); // 2D 렌더링 설정
        viewer.setAutoSize(false); // 자동 크기 조절 비활성화
        viewer.setDimension(width, height); // 크기 설정
        viewer.appendToElem(containerRef.current); // 참조된 div에 뷰어 추가
        viewer.setEnableToolbar(false);
        viewer.setAutofit(true);
        viewer.setZoom(0.9);
        viewer.setShowCaption(true);
        viewerRef.current = viewer; // 뷰어 인스턴스 저장
      }

      // chemObj prop이 변경되면 뷰어의 내용 업데이트
      if (chemObj && viewerRef.current) {
        console.log(`Loading chemObj: ${chemObj} (format: ${format})`);
        const mol = OCL.Molecule.fromSmiles(chemObj);

        try {
          const molecule = Kekule.IO.loadFormatData(mol.toMolfile(), "mol");
          if (molecule) {
            viewerRef.current.setChemObj(molecule);
            viewerRef.current.setCaption(formula);
            console.log("Molecule loaded successfully.");
          } else {
            console.error(`Failed to load molecule from data: ${chemObj}`);
            // 필요하다면 오류 처리 로직 추가 (예: 빈 화면 표시)
            viewerRef.current.setChemObj(null);
          }
        } catch (error) {
          console.error("Error loading chemical object:", error);
          // 필요하다면 오류 처리 로직 추가
          viewerRef.current.setChemObj(null);
        }
      } else if (viewerRef.current) {
        viewerRef.current.setChemObj(null); // 데이터가 없으면 뷰어 비우기
      }
    }

    // 컴포넌트 언마운트 시 정리 작업
    return () => {
      if (viewerRef.current && viewerRef.current.finalize) {
        console.log("Finalizing Kekule Viewer instance...");
        try {
          // Kekule.js 위젯의 자체 정리 메서드 호출
          viewerRef.current.finalize();
        } catch (e) {
          console.error("Error finalizing Kekule viewer:", e);
        }
        viewerRef.current = null; // 참조 제거
      }
      // DOM 요소를 직접 비우는 것은 React가 처리하므로 보통 필요 없음
      // if (containerRef.current) {
      //     containerRef.current.innerHTML = '';
      // }
    };
    // 의존성 배열: Kekule 준비 상태, chemObj, format, width, height 변경 시 useEffect 재실행
  }, [isKekuleReady, chemObj, format, width, height]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height, border: "1px solid #ccc" }}
    >
      {/* Kekule 뷰어가 이 div 내부에 렌더링됩니다. */}
      {!isKekuleReady && <p>Loading Kekule.js...</p>}
      {isKekuleReady && !chemObj && <p>No chemical data provided.</p>}
    </div>
  );
}

export default KekuleViewer;
