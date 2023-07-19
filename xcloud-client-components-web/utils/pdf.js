/**
 * @file 导出pdf文件
 */
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

export const createPDF = async (element, options) => {
  let pdf = new JsPDF('', 'pt', 'a4');
  element.id = 'pdf-create';
  // element是pdf的dom节点
  await html2canvas(element, {
    scale: options.scale,
    useCORS: true,
    allowTaint: false,
    taintTest: false,
  }).then(function(canvas) {
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    //一页pdf显示html页面生成的canvas高度;
    const pageHeight = (contentWidth / 595.28) * 841.89;
    //未生成pdf的html页面高度
    let leftHeight = contentHeight;
    //页面偏移
    let position = 0;
    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = 595.28;
    const imgHeight = (592.28 / contentWidth) * contentHeight;

    const pageData = canvas.toDataURL('image/jpeg', 1.0);
    if (leftHeight < pageHeight) {
      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      // 为下一条数据添加空白页
      pdf.addPage();
    } else {
      while (leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        //避免添加空白页
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    pdf.save(options.fileName);
    element.removeAttribute('id');
  });
};

export default createPDF;
