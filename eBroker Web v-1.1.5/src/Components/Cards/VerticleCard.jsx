import { AddFavourite } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";
import { formatPriceAbbreviated, isThemeEnabled, placeholderImage, translate } from "@/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import Image from "next/image";
import { ImageToSvg } from "./ImageToSvg";
import Swal from "sweetalert2";
import LoginModal from "../LoginModal/LoginModal";

function VerticalCard({ ele, removeCard, onImageLoad }) {


    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;

    const isLoggedIn = useSelector((state) => state.User_signup);

    const handleImageLoad = () => {
        if (onImageLoad) {
            onImageLoad();
        }
    };
    // Initialize isLiked based on ele?.is_favourite
    const [isLiked, setIsLiked] = useState(ele?.is_favourite === 1);

    // Initialize isDisliked as false
    const [isDisliked, setIsDisliked] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isLoggedIn && isLoggedIn.data && isLoggedIn.data.token) {
            AddFavourite(
                ele?.id,
                "1",
                (response) => {
                    setIsLiked(true);
                    setIsDisliked(false);
                    toast.success(response.message);
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            Swal.fire({
                title: translate("plzLogFirst"),
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                allowOutsideClick: true,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowModal(true)
                }
            });
        }
    };

    const handleDislike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        AddFavourite(
            ele?.id,
            "0",
            (response) => {
                setIsLiked(false);
                setIsDisliked(true);
                toast.success(response.message);
                if (removeCard) {
                    setIsLiked(true);

                    removeCard(ele?.id);
                }
            },
            (error) => {
                console.log(error);
            }
        );
    };

    useEffect(() => {
        // Update the state based on ele?.is_favourite when the component mounts
        setIsLiked(ele?.is_favourite === 1);
        setIsDisliked(false);
    }, [ele?.is_favourite]);

    const DummyImgData = useSelector(settingsData);
    const PlaceHolderImg = DummyImgData?.web_placeholder_logo;
    const themeEnabled = isThemeEnabled();

    return (
        <div className="verticle_card">
            <div className="card verticle_main_card">
                <div className="verticle_card_img_div">
                    <Image loading="lazy" className="card-img" id="verticle_card_img" src={ele?.title_image} alt="no_img" width={200} height={200} onLoad={handleImageLoad} onError={placeholderImage} />
                    {ele?.promoted ? <span className="feature_tag">{translate("feature")}</span> : null}

                    <span className="like_tag">
                        {isLiked ? (
                            <AiFillHeart size={25} className="liked_property" onClick={handleDislike} />
                        ) : isDisliked ? (
                            <AiOutlineHeart size={25} className="disliked_property" onClick={handleLike} />
                        ) : (
                            <AiOutlineHeart size={25} onClick={handleLike} />
                        )}
                    </span>
                    <span className="sell_teg">{ele?.property_type}</span>
                    <span className="price_teg">
                        {CurrencySymbol} {formatPriceAbbreviated(ele?.price)}
                    </span>
                </div>
                {/* <div className="card-img-overlay">
                </div> */}

                <div className="card-body">
                    <div className="feature_card_mainbody">
                        <div className="cate_image">
                            {themeEnabled ? (

                                <ImageToSvg imageUrl={ele?.category && ele?.category.image} className="custom-svg" />
                            ) : (
                                <Image loading="lazy" src={ele?.category && ele?.category.image} alt="no_img" width={20} height={20} onError={placeholderImage} />
                            )}

                        </div>
                        <span className="feature_body_title"> {ele?.category && ele?.category.category} </span>
                    </div>
                    <div className="feature_card_middletext">
                        <span>{ele?.title}</span>
                        <p>
                            {ele?.city} {ele?.city ? "," : null} {ele?.state} {ele?.state ? "," : null} {ele?.country}
                        </p>
                    </div>
                </div>

                <div className="card-footer" id="feature_card_footer">
                    <div className="row">
                        {ele?.parameters &&
                            ele?.parameters.slice(0, 4).map((elem, index) => (
                                elem?.value !== "" && elem?.value !== "0" &&
                                <div div className="col-12 col-sm-6 col-md-6 " key={index} >
                                    <div className="footer_content" key={index}>
                                        <div className="footer_img_value">
                                            {themeEnabled ? (

                                                <ImageToSvg imageUrl={elem?.image} className="custom-svg" />
                                            ) : (
                                                <Image loading="lazy" src={elem?.image} alt="no_img" width={20} height={16} onError={placeholderImage} />
                                            )}
                                            <p className="text_footer">
                                                {Array.isArray(elem?.value) ? elem.value.slice(0, 2).join(', ') : elem.value}
                                            </p>


                                        </div>
                                        <p className="text_footer_name"> {elem?.name}</p>
                                    </div>
                                </div>


                            ))}
                    </div>
                </div>
            </div>
            {
                showModal &&
                <LoginModal isOpen={showModal} onClose={handleCloseModal} />
            }
        </div >
    );
}

export default VerticalCard;
