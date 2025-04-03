import React, { useEffect, useState } from "react";
import { data } from "react-router-dom";

const ProvinceSelect = ({ formData, setFormData, errors }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);


  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0 && Array.isArray(data.data)) {
          setProvinces(data.data);
        } else {
          console.error("Dữ liệu tỉnh thành không hợp lệ");
        }
      })
      .catch((err) => console.error("Lỗi khi lấy tỉnh thành:", err));
  }, []);

  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/2/66.htm")
    .then((response) => response.json())
    .then((data) => {
        if (data.error === 0 && Array.isArray(data.data)) {
          setDistricts(data.data);
        } else {
          console.error("Dữ liệu thành phố không hợp lệ");
        }
    })
    .catch((err) => console.error("Lỗi khi lấy thành phố:", err));
  },[]);

  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/3/643.htm")
    .then((response) => response.json())
    .then((data) => {
        if(data.error ===0 && Array.isArray(data.data)){
            setWards(data.data);
        }else{
            console.error("Dữ liệu phường/xã không hợp lệ");
        }
    })
    .catch((err) => console.error("Lỗi khi lấy phường/xã:", err));
  });

  return (
    <>
      {/* Tỉnh/Thành + Quận/Huyện */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tỉnh/Thành */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành Phố</label>
          <select
            className={`mt-1 block w-full rounded-md border ${
              errors.province ? "border-red-500" : "border-gray-300"
            } px-3 py-2`}
            value={formData.province}
            onChange={(e) =>
              setFormData({ ...formData, province: e.target.value, district: "", ward: "" })
            }
          >
            <option value="">Chọn Tỉnh/Thành</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm mt-1">{errors.province}</p>
          )}
        </div>

        {/* Quận/Huyện (hiện chưa load từ API) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
          <select
            className={`mt-1 block w-full rounded-md border ${
              errors.district ? "border-red-500" : "border-gray-300"
            } px-3 py-2`}
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) =>(
                <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">{errors.district}</p>
          )}
        </div>
      </div>

      {/* Phường/Xã (hiện chưa load từ API) */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
        <select
          className={`mt-1 block w-full rounded-md border ${
            errors.ward ? "border-red-500" : "border-gray-300"
          } px-3 py-2`}
          value={formData.ward}
          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((wards) =>(
            <option key={wards.id} value={wards.id}>{wards.name}</option>
          ))}
        </select>
        {errors.ward && (
          <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
        )}
      </div>
    </>
  );
};

export default ProvinceSelect;
