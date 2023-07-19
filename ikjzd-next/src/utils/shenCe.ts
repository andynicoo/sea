/**
 * 神策埋点
 */
const bannerClick = (params: {
  bannerID: number | string;
  bannerName: string;
  pageName: string;
  userId: string;
  mobile: string;
}) => {
  const sensors = (window as any)["sensorsDataAnalytic201505"];
  sensors.track("BannerClick", {
    B_banner_id: params.bannerID,
    banner_name: params.bannerName,
    page_name: params.pageName,
    brand_register_user: params.userId,
    User_phonenumber: params.mobile,
  });
};

export { bannerClick };
