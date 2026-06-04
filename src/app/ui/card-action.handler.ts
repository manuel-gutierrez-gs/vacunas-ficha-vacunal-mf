type VacunaSheetDetail = Record<string, unknown>;

type SheetElement = HTMLElement & {
  detail?: VacunaSheetDetail;
  payload?: VacunaSheetDetail;
  open?: boolean;
};

let activeSheet: SheetElement | null = null;
let activeCleanup: (() => void) | null = null;
let openRequestId = 0;

const SHEET_TAG = 'wc-stic-sheet';
const CLOSE_EVENTS = ['close', 'dismiss', 'overlay-close', 'closed', 'stic-sheet:close'];

export function openVacunaSheet(detail: VacunaSheetDetail): void {
  const requestId = ++openRequestId;
  disposeActiveSheet();

  queueMicrotask(() => {
    if (requestId !== openRequestId) {
      return;
    }
    mountSheet(detail);
  });
}

function mountSheet(detail: VacunaSheetDetail): void {
  const staleSheet = document.body.querySelector(SHEET_TAG);
  if (staleSheet instanceof HTMLElement && staleSheet !== activeSheet) {
    staleSheet.remove();
  }

  const sheet = document.createElement(SHEET_TAG) as SheetElement;
  sheet.detail = detail;
  sheet.payload = detail;
  sheet.open = true;

  const handleClose = () => {
    if (activeSheet !== sheet) {
      return;
    }
    disposeActiveSheet();
  };

  for (const eventName of CLOSE_EVENTS) {
    sheet.addEventListener(eventName, handleClose);
  }

  activeCleanup = () => {
    for (const eventName of CLOSE_EVENTS) {
      sheet.removeEventListener(eventName, handleClose);
    }
  };

  activeSheet = sheet;
  if (!sheet.isConnected) {
    document.body.appendChild(sheet);
  }
}

function disposeActiveSheet(): void {
  if (!activeSheet) {
    return;
  }

  activeCleanup?.();
  activeCleanup = null;

  if (activeSheet.isConnected) {
    activeSheet.remove();
  }

  activeSheet = null;
}
