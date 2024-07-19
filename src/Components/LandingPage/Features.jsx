import React from 'react'

function Features() {
  return (
    <div style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10%", paddingRight: "10%", flexDirection: "column",  marginTop:"50px", backgroundColor:"#fbf9f9" }}>
        <h3 style={{ fontWeight: "bold", marginTop:"20px" }}>FEATURES</h3>
        <div className='row' style={{ justifyContent: "space-around", display: "flex", alignItems: "center", width: "100vw", marginTop: "20px" }}>
          <div className='col-md-2' style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "30vh", marginTop: "10px" }}>
            <div class="card" style={{ width: "18rem" }}>
              <div class="card-body" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <h5 class="card-title">Schema Managment</h5>
                <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
          <div className='col-md-2' style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "30vh", marginTop: "10px" }}>
            <div class="card" style={{ width: "18rem" }}>
              <div class="card-body" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <h5 class="card-title">Routes Managment</h5>
                <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
          <div className='col-md-2' style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "30vh", marginTop: "10px" }}>
            <div class="card" style={{ width: "18rem" }}>
              <div class="card-body" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <h5 class="card-title">Role Managment</h5>
                <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
          <div className='col-md-2' style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "30vh", marginTop: "10px" }}>
            <div class="card" style={{ width: "18rem" }}>
              <div class="card-body" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <h5 class="card-title">Permission Managment</h5>
                <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>


          {/* <div className='col-md-3' style={{backgroundColor:"violet", height:"30vh"}}></div> */}


        </div>
      </div>
  )
}

export default Features