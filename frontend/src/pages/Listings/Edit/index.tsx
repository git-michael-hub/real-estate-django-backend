export default function Edit() {
    return (
        <section id="new-listing">
            {/* <form id="new-listing-container" onSubmit={submitForm}>
              <section className="header-section">
                  <BtnEdit onClick={(e) => toggleDisplay(e, setIsEditHeaderActive, isEditHeaderActive)}>
                      preview
                  </BtnEdit>

                  <div className={isEditHeaderActive ? "header-edit" : "header-edit hidden"}>
                      <div className="row row-1">
                          <InputWithLabel
                              inputProps={{
                                  name: "title",
                                  defaultValue: title,
                                  placeholder: "Listing Title",
                                  onChange: (e) => setTitle(e.currentTarget.value),
                              }}
                          >
                              Title
                          </InputWithLabel>
                      </div>
                      <div className="row row-2">
                          <InputWithLabel
                              inputProps={{
                                  name: "price",
                                  defaultValue: price,
                                  type: "number",
                                  placeholder: listingType === "FR" ? "(Php / month)" : "(Php)",
                                  min: 0,
                                  onChange: (e) => editNum(e, setPrice),
                              }}
                          >
                              {listingType === "FR" ? "Price / month" : "Price"}
                          </InputWithLabel>

                          <SelectWithLabel
                              label="Listing Type"
                              selectProps={{
                                  name: "listing_type",
                                  defaultValue: listingType,
                                  "aria-placeholder": "Listing Type",
                                  onChange: (e) => setListingType(e.currentTarget.value as "FS" | "FR" | "FC"),
                              }}
                          >
                              <option value="FS">{LISTING_TYPE["FS"]}</option>
                              <option value="FR">{LISTING_TYPE["FR"]}</option>
                              <option value="FC">{LISTING_TYPE["FC"]}</option>
                          </SelectWithLabel>
                          <SelectWithLabel
                              label="Property Type"
                              selectProps={{
                                  name: "property_type",
                                  defaultValue: propertyType,
                                  "aria-placeholder": "Property Type",
                                  onChange: (e) => setPropertyType(e.currentTarget.value as "HL" | "RL" | "CL" | "CO"),
                              }}
                          >
                              <option value="HL">{PROPERTY_TYPE["HL"]}</option>
                              <option value="RL">{PROPERTY_TYPE["RL"]}</option>
                              <option value="CL">{PROPERTY_TYPE["CL"]}</option>
                              <option value="CO">{PROPERTY_TYPE["CO"]}</option>
                          </SelectWithLabel>
                      </div>
                      <label>Address</label>
                      <div className="row row-3">
                          <InputBasic
                              name="street"
                              defaultValue={street}
                              placeholder="Street"
                              onChange={(e) => setStreet(e.currentTarget.value)}
                          />
                          <InputBasic
                              name="baranggay"
                              defaultValue={baranggay}
                              placeholder="Baranggay"
                              onChange={(e) => setBaranggay(e.currentTarget.value)}
                          />
                          <InputBasic
                              name="city"
                              defaultValue={city}
                              placeholder="City"
                              onChange={(e) => setCity(e.currentTarget.value)}
                          />
                          <InputBasic
                              name="province"
                              defaultValue={province}
                              placeholder="Province"
                              onChange={(e) => setProvince(e.currentTarget.value)}
                          />
                      </div>
                  </div>
                  {isEditHeaderActive ? (
                      <></>
                  ) : (
                      <>
                          <h2>{title ? title : <span style={{ color: "gray" }}>"No Title"</span>}</h2>
                          <div>
                              <b>
                                  Php {helperFn.insertComma(price ? price : 0)}{" "}
                                  {listingType === "FR" ? <>/ mo.</> : <></>}
                              </b>{" "}
                              <Tag className="tag-1">{LISTING_TYPE[listingType]}</Tag>{" "}
                              <Tag className="tag-2">{PROPERTY_TYPE[propertyType]}</Tag>
                          </div>
                          <address>
                              <i className="fa-solid fa-location-dot"></i>{" "}
                              {`${street}, ${baranggay}, ${city}, ${province}`}
                          </address>
                      </>
                  )}
              </section>
              <section className="listing-details">
                  <div className="listing-image-list">
                      <BtnImageUpload
                          imageFile={image1}
                          inputProps={{ onChange: (e) => (e.target.files ? setImage1(e.target.files[0]) : {}) }}
                          buttonProps={{ onClick: () => setImage1(null) }}
                      ></BtnImageUpload>

                      <BtnImageUpload
                          imageFile={image2}
                          inputProps={{ onChange: (e) => (e.target.files ? setImage2(e.target.files[0]) : {}) }}
                          buttonProps={{ onClick: () => setImage2(null) }}
                      ></BtnImageUpload>
                      <BtnImageUpload
                          imageFile={image3}
                          inputProps={{ onChange: (e) => (e.target.files ? setImage3(e.target.files[0]) : {}) }}
                          buttonProps={{ onClick: () => setImage3(null) }}
                      ></BtnImageUpload>
                      <BtnImageUpload
                          imageFile={image4}
                          inputProps={{ onChange: (e) => (e.target.files ? setImage4(e.target.files[0]) : {}) }}
                          buttonProps={{ onClick: () => setImage4(null) }}
                      ></BtnImageUpload>
                      <BtnImageUpload
                          imageFile={image5}
                          inputProps={{ onChange: (e) => (e.target.files ? setImage5(e.target.files[0]) : {}) }}
                          buttonProps={{ onClick: () => setImage5(null) }}
                      ></BtnImageUpload>
                  </div>

                  <div>
                      <BtnEdit onClick={(e) => toggleDisplay(e, setIsEditListingInfoActive, isEditListingInfoActive)}>
                          preview
                      </BtnEdit>
                      <h3>Overview</h3>
                      <div className={isEditListingInfoActive ? "edit-listing-info" : "edit-listing-info hidden"}>
                          <span>
                              <i className="fa-solid fa-expand"></i>{" "}
                              <InputBasic
                                  placeholder="Property Size (sqm)"
                                  type="number"
                                  name="property_size"
                                  min={0}
                                  onChange={(e) => editNum(e, setPropertySize)}
                                  defaultValue={propertySize}
                              />
                          </span>
                          {propertyType === "RL" ? (
                              <></>
                          ) : propertyType === "CL" ? (
                              <></>
                          ) : (
                              <>
                                  <span>
                                      <i className="fa-solid fa-bed"></i>
                                      <InputBasic
                                          placeholder="No. of bedrooms"
                                          type="number"
                                          name="bedrooms"
                                          min={0}
                                          onChange={(e) => editNum(e, setBedrooms)}
                                          defaultValue={bedrooms}
                                      />
                                  </span>
                                  <span>
                                      <i className="fa-solid fa-shower"></i>
                                      <InputBasic
                                          placeholder="No. of bathrooms"
                                          type="number"
                                          name="bathrooms"
                                          min={0}
                                          onChange={(e) => editNum(e, setBathrooms)}
                                          defaultValue={bathrooms}
                                      />
                                  </span>
                              </>
                          )}
                      </div>
                      {isEditListingInfoActive ? (
                          <></>
                      ) : (
                          <div className="listing-info">
                              {propertySize ? (
                                  <span>
                                      <i className="fa-solid fa-expand"></i> {propertySize.toString()} sqm
                                  </span>
                              ) : (
                                  <></>
                              )}

                              {bedrooms ? (
                                  <span>
                                      <i className="fa-solid fa-bed"></i> {bedrooms.toString()}
                                  </span>
                              ) : (
                                  <></>
                              )}
                              {bathrooms ? (
                                  <span>
                                      <i className="fa-solid fa-shower"></i> {bathrooms.toString()}
                                  </span>
                              ) : (
                                  <></>
                              )}
                          </div>
                      )}
                  </div>

                  <div className="listing-description">
                      <BtnEdit onClick={(e) => toggleDisplay(e, setIsEditDescriptionActive, isEditDescriptionActive)}>
                          preview
                      </BtnEdit>
                      <h3>Description</h3>
                      {isEditDescriptionActive ? <></> : <p>{description}</p>}
                      <TextAreaBasic
                          onChange={(e) => setDescription(e.target.value)}
                          defaultValue={description}
                          name="description"
                          className={isEditDescriptionActive ? "textarea-basic" : "textarea-basic hidden"}
                      />
                  </div>
                  <input type="checkbox" name="is_available" defaultChecked={true} className="hidden" />
                  <input type="hidden" name="seller" defaultValue={user?.id} />
              </section>
              <BtnBasicActive id="create-new-listing-btn" type="submit">
                  Save Listing
              </BtnBasicActive>
          </form> */}
        </section>
    );
}
