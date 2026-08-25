"use client";
import stateData from "@/utils/stateData";
import styles from "./details.module.css";
import Select from "react-select";
import { useEffect, useState } from "react";
import { validateEmail, validatePhone } from "@/utils/validators";

const stateOptions = stateData();

const Details = ({ formData, updateForm }) => {
  // ===== Stateهای مربوط به انتخاب آدرس قبلی =====
  const [savedAddresses, setSavedAddresses] = useState([]); // لیست آدرس‌های ذخیره‌شده کاربر
  const [selectedAddressId, setSelectedAddressId] = useState(null); // آیدی آدرس انتخاب‌شده
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false); // وضعیت لودینگ

  // ===== Stateهای مربوط به Select استان و شهر =====
  const [stateSelectedOption, setStateSelectedOption] = useState(null);
  const [citySelectedOption, setCitySelectedOption] = useState(null);
  const [citySelectorDisabled, setCitySelectorDisabled] = useState(true);
  const [cityOption, setCityOption] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // ===== دریافت لیست آدرس‌های کاربر (شما منطقش را کامل می‌کنید) =====
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        console.log(data.addresses);
        setSavedAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const createNewAddress = async () => {
    // Validation
    const requiredFields = [
      { field: formData.firstname, name: "نام" },
      { field: formData.lastname, name: "نام خانوادگی" },
      { field: formData.state, name: "استان" },
      { field: formData.city, name: "شهر" },
      { field: formData.address, name: "آدرس خیابان" },
      { field: formData.postalCode, name: "کد پستی" },
      { field: formData.phone, name: "تلفن" },
      { field: formData.email, name: "ایمیل" },
    ];

    for (const item of requiredFields) {
      if (!item.field || item.field.trim() === "") {
        return swal({
          title: "خطا",
          text: `فیلد ${item.name} نمیتواند خالی باشد`,
          icon: "error",
          buttons: "تایید",
        });
      }
    }

    if (!validateEmail(formData.email))
      return swal({
        title: "خطا",
        text: "ایمیل نامعتبر است!",
        icon: "error",
        buttons: "تایید",
      });
    if (!validatePhone(formData.phone))
      return swal({
        title: "خطا",
        text: "شماره تلفن نامعتبر است!",
        icon: "error",
        buttons: "تایید",
      });

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.status == 201) {
        await fetchAddresses();

        return swal({
          title: "موفقیت",
          text: "آدرس با موفقیت ایجاد شد",
          icon: "success",
          buttons: "تایید",
        });
      } else {
        return swal({
          title: "خطا",
          text: "خطا در ایجاد آدرس!",
          icon: "error",
          buttons: "تلاش مجدد",
        });
      }
    } catch (error) {
      return swal({
        title: "خطا",
        text: "مشکل ارتباط در سمت سرور!",
        icon: "error",
        buttons: "تلاش مجدد",
      });
    }
  };

  // ===== پر کردن فرم با آدرس انتخاب‌شده =====
  const handleAddressSelect = (selectedOption) => {
    setSelectedAddressId(selectedOption?.value || null);
    if (selectedOption) {
      // ⚠️ آدرس کامل را از لیست savedAddresses پیدا کنید و در فرم قرار دهید
      const fullAddress = savedAddresses.find(
        (addr) => addr._id === selectedOption.value,
      );
      if (fullAddress) {
        updateForm("firstname", fullAddress.firstname || "");
        updateForm("lastname", fullAddress.lastname || "");
        updateForm("company", fullAddress.company || "");
        updateForm("state", fullAddress.state || "");
        updateForm("city", fullAddress.city || "");
        updateForm("address", fullAddress.address || "");
        updateForm("postalCode", fullAddress.postalCode || "");
        updateForm("phone", fullAddress.phone || "");
        updateForm("email", fullAddress.email || "");
      }
    } else {
      // اگر گزینه‌ای انتخاب نشد، فرم را خالی کنید
      updateForm("firstname", "");
      updateForm("lastname", "");
      updateForm("company", "");
      updateForm("state", "");
      updateForm("city", "");
      updateForm("address", "");
      updateForm("postalCode", "");
      updateForm("phone", "");
      updateForm("email", "");
    }
  };

  // ===== همگام‌سازی استان و شهر با formData =====
  useEffect(() => {
    if (formData.state) {
      const matched = stateOptions.find((opt) => opt.label === formData.state);
      if (matched) {
        setStateSelectedOption(matched);
      }
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.city) {
      const matched = cityOption.find((opt) => opt.label === formData.city);
      if (matched) {
        setCitySelectedOption(matched);
      }
    }
  }, [formData.city, cityOption]);

  useEffect(() => {
    setCitySelectedOption(null);
    if (stateSelectedOption?.value) {
      const city = stateSelectedOption.value.map((data) => ({
        value: data,
        label: data,
      }));
      setCityOption(city);
      setCitySelectorDisabled(false);
      updateForm("state", stateSelectedOption.label);
    } else {
      setCitySelectorDisabled(true);
      setCityOption([]);
      updateForm("state", "");
    }
  }, [stateSelectedOption]);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleStateChange = (selectedOption) => {
    setStateSelectedOption(selectedOption);
  };

  const handleCityChange = (selectedOption) => {
    setCitySelectedOption(selectedOption);
    updateForm("city", selectedOption?.label || "");
  };

  // ===== تبدیل لیست آدرس‌ها به فرمت React-Select =====
  const addressOptions = savedAddresses.map((addr, index) => ({
    value: addr._id,
    label: `آدرس ${index + 1}: ${addr.nickname ? addr.nickname : addr.address}`,
  }));

  return (
    <div className={styles.details}>
      <p className={styles.details_title}>جزئیات صورتحساب</p>

      <form className={styles.form}>
        {/* ===== انتخاب آدرس قبلی ===== */}
        <div className={styles.group}>
          <label>انتخاب آدرس قبلی</label>

          <Select
            value={
              selectedAddressId
                ? addressOptions.find((opt) => opt.value === selectedAddressId)
                : null
            }
            onChange={handleAddressSelect}
            isClearable={true}
            placeholder={
              isLoadingAddresses ? "در حال بارگذاری..." : "انتخاب کنید..."
            }
            isRtl={true}
            isSearchable={true}
            options={addressOptions}
            instanceId="address-select"
            isDisabled={isLoadingAddresses}
          />
        </div>

        {/* ===== فیلدهای فرم (بدون تغییر) ===== */}
        <div className={styles.groups}>
          <div className={styles.group}>
            <label>
              نام خانوادگی <span>*</span>
            </label>
            <input
              onChange={(event) => updateForm("lastname", event.target.value)}
              value={formData.lastname}
              type="text"
            />
          </div>
          <div className={styles.group}>
            <label>
              نام <span>*</span>
            </label>
            <input
              onChange={(event) => updateForm("firstname", event.target.value)}
              value={formData.firstname}
              type="text"
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>نام شرکت (اختیاری)</label>
          <input
            onChange={(event) => updateForm("company", event.target.value)}
            value={formData.company}
            type="text"
          />
        </div>

        {/* ===== استان ===== */}
        <div className={styles.group}>
          <label>
            استان<span>*</span>
          </label>
          {isClient && (
            <Select
              value={stateSelectedOption}
              onChange={handleStateChange}
              isClearable={true}
              placeholder=""
              isRtl={true}
              isSearchable={true}
              options={stateOptions}
              instanceId="state-select"
            />
          )}
          {!isClient && <input type="text" placeholder="استان" disabled />}
        </div>

        {/* ===== شهر ===== */}
        <div className={styles.group}>
          <label>
            شهر<span>*</span>
          </label>
          {isClient && (
            <Select
              value={citySelectedOption}
              onChange={handleCityChange}
              isDisabled={citySelectorDisabled}
              isClearable={true}
              isRtl={true}
              isSearchable={true}
              options={cityOption}
              placeholder=""
              instanceId="city-select"
            />
          )}
          {!isClient && <input type="text" placeholder="شهر" disabled />}
        </div>

        <div className={styles.group}>
          <label>
            آدرس خیابان<span>*</span>
          </label>
          <input
            onChange={(event) => updateForm("address", event.target.value)}
            value={formData.address}
            type="text"
          />
        </div>

        <div className={styles.group}>
          <label>
            کدپستی (بدون فاصله)<span>*</span>
          </label>
          <input
            onChange={(event) => updateForm("postalCode", event.target.value)}
            value={formData.postalCode}
            type="text"
          />
        </div>

        <div className={styles.group}>
          <label>
            شماره موبایل <span>*</span>
          </label>
          <input
            onChange={(event) => updateForm("phone", event.target.value)}
            value={formData.phone}
            type="text"
          />
        </div>

        <div className={styles.group}>
          <label>
            ایمیل <span>*</span>
          </label>
          <input
            onChange={(event) => updateForm("email", event.target.value)}
            value={formData.email}
            type="email"
          />
        </div>

        {/* ===== بخش ایجاد آدرس جدید ===== */}
        <div className={styles.create_account}>
          <h5>ایجاد آدرس جدید</h5>
          <section>
            <div className={styles.group}>
              <label>نام مستعار آدرس (اختیاری)</label>
              <input
                placeholder="مثلاً: محل کار، منزل، ..."
                type="text"
                value={formData.nickname}
                onChange={(event) => updateForm("nickname", event.target.value)}
              />
            </div>
            <button
              type="button"
              // ⚠️ اینجا باید منطق ارسال به بک‌اند را خودتان پیاده‌سازی کنید
              onClick={createNewAddress}
            >
              ذخیره آدرس جدید
            </button>
          </section>
        </div>

        {/* ===== توضیحات سفارش ===== */}
        <div className={styles.destination}>
          <label>توضیحات سفارش (اختیاری)</label>
          <textarea
            value={formData.notes}
            onChange={(event) => updateForm("notes", event.target.value)}
            cols="30"
            rows="8"
            placeholder="اگر توضیحی در مورد سفارش خود دارید در اینجا ثبت کنید"
          />
        </div>
      </form>
    </div>
  );
};

export default Details;
