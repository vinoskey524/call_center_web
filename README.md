# Script to create new react project
npx create-react-app myProjectName --template typescript

# How to pause a for loop
const n = 100000;
for (let i = 0; i < n; i++) {
    /* Pause loop for 1sec every 500 loop */
    (i > 0 && i % 500 === 0) && await new Promise((resolve) => {
        console.log(n - i, 'remaining loop');
        setTimeout(resolve, 1000);
    });

    /* - */
    // if (stopMenuSearchingLoop.current) { console.warn('loop stopped at ::', i); break; };
    if (i === (n - 1)) console.log('loop ended', i);
}

# customer dashboard Header


<div /* Header */ className='ctmdmw_header'>
    <div className='ctmdmw_header_backdrop glass' />
    <div className='ctmdmw_header_container'>
        <h1 className='ctmdmw_enterprise_title'>Pebco</h1>

        <div id={ctmdmw_home_btn_container_id} className='ctmdmw_h_btn_container btn_opacity' style={{ backgroundColor: '#007aff' }} onClick={onHomeSelectFunc}>
            <div id={ctmdmw_home_btn_title_id} className='ctmdmw_h_btn_title' style={{ color: 'white' }}>Acceuil</div>
        </div>

        <div id={ctmdmw_complaint_btn_container_id} className='ctmdmw_h_btn_container'>
            <div id={ctmdmw_complaint_btn_title_id} className='ctmdmw_h_btn_title btn_opacity' onClick={onComplaintSelectFunc}>Plaintes</div>
            <div id='ctmdmw_complaint_filter_selector' className='glass'>
                <div className='ctmdmw_complaint_filter_option btn_opacity' onClick={() => setComplaintFilterFunc({ filter: 'non_traites' })}>Non traités <p className='ctmdmw_complaint_filter_opt_count'>(20)</p></div>
                <div className='ctmdmw_complaint_filter_option btn_opacity' onClick={() => setComplaintFilterFunc({ filter: 'en_traitement' })}>En traitement <p className='ctmdmw_complaint_filter_opt_count'>(10)</p></div>
                <div className='ctmdmw_complaint_filter_option btn_opacity' onClick={() => setComplaintFilterFunc({ filter: 'traites' })}>Traités <p className='ctmdmw_complaint_filter_opt_count'>(8)</p></div>
            </div>
        </div>

        <div id={ctmdmw_product_btn_container_id} className='ctmdmw_h_btn_container btn_opacity' style={{ backgroundColor: '#007aff' }} onClick={onProductSelectFunc}>
            <div id={ctmdmw_product_btn_title_id} className='ctmdmw_h_btn_title' style={{ color: 'white' }}>Produits</div>
        </div>

        <div className='ctmdmw_hv_separator' />

        <div id='ctmdmw_h_search_container'>
            <img id='ctmdmw_h_search_icon' src={search_icon} />
            <input id='ctmdmw_h_search_bar' type='text' placeholder='Search' />
        </div>

        <div className='ctmdmw_hv_separator' />

        <div id='ctmdmw_add_btn_container'>
            <div id='ctmdmw_add_btn_title' className='btn_opacity' onClick={onAddProduitComplaintFunc}>+ Ajouter</div>
            <div id='ctmdmw_add_option_container'>
                <div className='ctmdmw_add_option_title btn_opacity' onClick={addProductFunc}>Produit</div>
                <div className='ctmdmw_title_separator' />
                <div className='ctmdmw_add_option_title btn_opacity' onClick={addComplaintFunc}>Plainte</div>
            </div>
        </div>
    </div>
</div>

/* Header */

.ctmdmw_header {
    width: 100%;
    height: var(--dashboard_header_height);
    overflow: visible;
    position: absolute;
    display: flex;
    justify-content: center;
    top: 0px;
    left: 0px;
    padding-inline: 10px;
    z-index: 5;
}

.ctmdmw_header_backdrop {
    width: 100%;
    height: var(--dashboard_header_height);
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 0;
}

.ctmdmw_header_container {
    width: auto;
    height: var(--dashboard_header_height);
    overflow: visible;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: transparent;
    padding-inline: 10px;
    z-index: 1;
}

.ctmdmw_enterprise_title {
    width: auto;
    height: auto;
    color: #D3E4FD;
    margin-right: 12px;
}

/* header btn */

.ctmdmw_h_btn_container {
    width: auto;
    height: auto;
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    margin-inline: 4px;
    margin-top: 4px;
}

.ctmdmw_h_btn_container:hover {
    background-color: rgba(51, 58, 69, 0.7);
}

.ctmdmw_h_btn_title {
    width: auto;
    height: 25px;
    color: #95A6BD;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border-radius: 50px;
    padding-inline: 14px;
}

/* Complaint filter selector */

#ctmdmw_complaint_filter_selector {
    width: auto;
    min-width: 160px;
    height: auto;
    overflow: hidden;
    position: absolute;
    display: none;
    flex-direction: column;
    align-items: center;
    top: 42px;
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #525357;
    opacity: 0;
    scale: 0.8;
    z-index: 10;
}

.ctmdmw_complaint_filter_option {
    width: 100%;
    height: auto;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    font-size: 13.5px;
    border-radius: 4px;
    padding-block: 2px;
    padding-inline: 6px;
    margin-block: 1px;
}

.ctmdmw_complaint_filter_option:hover {
    background-color: #373c47;
}

.ctmdmw_complaint_filter_opt_count {
    width: auto;
    height: auto;
    font-size: 12px;
    color: #9e9e9e;
    margin-left: 6px;
}

.ctmdmw_option_separator {
    width: 90%;
    height: 1px;
    background-color: rgba(134, 150, 170, 0.1);
    margin-block: 3px;
}


/* - */

.ctmdmw_hv_separator {
    width: 1px;
    height: 13px;
    margin-inline: 10px;
    margin-top: 6px;
    background-color: rgba(51, 58, 69, 1);
}

#ctmdmw_h_search_container {
    width: 250px;
    height: 25px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 6px;
    background-color: #333A45;
    color: white;
    margin-left: 3px;
    margin-top: 4px;
    padding-inline: 10px;
}

#ctmdmw_h_search_icon {
    width: 16px;
    height: 16px;
}

#ctmdmw_h_search_bar {
    flex: 1;
    overflow: hidden;
    background-color: transparent;
    color: white;
    margin-left: 3px;
}

/* Add btn */

#ctmdmw_add_btn_container {
    width: auto;
    height: 23px;
    overflow: visible;
    position: relative;
    margin-top: 4px;
}

#ctmdmw_add_btn_title {
    width: auto;
    height: 23px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-inline: 12px;
    background-color: #0067FF;
    border-radius: 6px;
    font-size: 12px;
    color: white;
    margin-top: -1.2px;
}

/* Add option */

#ctmdmw_add_option_container {
    width: 130px;
    height: auto;
    overflow: hidden;
    position: absolute;
    top: 25px;
    left: 0px;
    border-radius: 8px;
    display: none;
    flex-direction: column;
    align-items: center;
    padding: 4px;
    background-color: rgba(31, 32, 39, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid #525357;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
    opacity: 0;
    scale: 0.8;
    z-index: 100;
}

.ctmdmw_add_option_title {
    width: 100%;
    height: 22px;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding-inline: 10px;
    color: white;
    font-size: 13px;
    border-radius: 4px;
}

.ctmdmw_add_option_title:hover {
    background-color: #373c47;
}

.ctmdmw_title_separator {
    width: 90%;
    height: 1px;
    background-color: rgba(134, 150, 170, 0.1);
    margin-block: 3px;
}

/* Body */

.ctmdmw_body {
    width: 100%;
    height: 100%;
    overflow: visible;
    position: relative;
    background-color: #23272F;
    padding-inline: 5px;
    z-index: 0;
}