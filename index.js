/**
 * @typedef {Object} Config 設定
 * @property {string} [color='orange'] 四角の色
 * @property {number} [width=4] 四角の線の太さ
 * @property {number} [margin=4] 要素と四角の間隔
 * @property {string} [fontcolor='white'] フォントカラー
 * @property {number} [fontsize=12] 添字のフォントサイズ
 */

/**
 * 指定した HTML 要素を資格で囲むクラス
 * @class
 */
class DrawRectToHtml {
  /**
   * @constructor
   * @param {string[]} selectors CSSセレクターの配列
   * @param {Config} config 設定
   */
  constructor(selectors, config) {
    /**
     * 対象のHTML要素の座標の配列
     * @type {(DOMRect | undefined)[]}
     */
    this.elements = selectors.map((selector) => {
      const element = document.querySelector(selector);
      if (!element) return;
      return element.getBoundingClientRect();
    });

    /**
     * Canvas要素
     * @type {HTMLCanvasElement | null}
     */
    this.canvas = document.createElement('canvas');

    /**
     * 設定
     * @type {Config}
     */
    this.config = {
      color: 'orange',
      width: 4,
      margin: 4,
      fontcolor: 'white',
      fontsize: 12,
      ...config,
    };
  }

  /**
   * 描画する
   */
  draw() {
    if (!this.canvas) return;
    // キャンバスサイズ設定
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;

    // コンテキストを取得
    const context = this.canvas.getContext('2d');

    // 全エレメントに囲いと添字を描画する
    this.elements.forEach((element, index) => {
      if (!element) return;

      // 添字の囲みを描画
      context.beginPath();
      context.fillStyle = this.config.color;
      context.arc(
        element.left - this.config.margin + this.config.fontsize,
        element.top - (this.config.margin * 2) - this.config.fontsize,
        this.config.fontsize,
        0,
        2 * Math.PI,
        false,
      );
      context.closePath();
      context.fill();

      // 添字を描画
      context.fillStyle = this.config.fontcolor;
      context.font = `${this.config.fontsize}px ariel`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(
        index + 1,
        element.left - this.config.margin + this.config.fontsize,
        element.top - (this.config.margin * 2) - this.config.fontsize,
      );

      // 囲いを描画
      context.beginPath();
      context.lineWidth = this.config.width;
      context.strokeStyle = this.config.color;
      context.rect(
        element.left - this.config.margin,
        element.top - this.config.margin,
        element.width + (this.config.margin * 2),
        element.height + (this.config.margin * 2),
      );
      context.stroke();
    });

    document.body.appendChild(this.canvas);
  }

  /**
   * 破棄する
   */
  dispose() {
    if (!this.canvas) return;
    this.canvas.remove();
    this.canvas = null;
  }
}