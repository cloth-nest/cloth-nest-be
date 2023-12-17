export class CurrencyUtil {
  public static converVNDToUSD(vnd: number): number {
    return vnd / 20000;
  }

  public static converUSDToVND(usd: number): number {
    return usd * 20000;
  }
}
