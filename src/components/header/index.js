// import React from "react";
// import { Row, Col, Card } from "antd";

// const styles = {
//   row: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   icon: {
//     width: "24px",
//     height: "24px",
//     marginRight: "10px",
//     borderRadius: "12px",
//     // backgroundColor: '#0091ff',
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   i: {
//     // color: '#fff',
//     fontSize: "16px",
//   },
// };

// const Header = ({ icon, title, right }) => {
//   const size = { xs: 12, sm: 12, md: 12, lg: 12 };

//   return (
//     <Row gutter={12} className="mb-10">
//       <Col span={24}>
//         <Card bordered={false}>
//           <Row>
//             <Col {...size}>
//               <div style={styles.row}>
//                 <div style={styles.icon}>
//                   <i className="material-icons-outlined" style={styles.i}>
//                     {icon}
//                   </i>
//                 </div>
//                 <h1 className="h1">{title}</h1>
//               </div>
//             </Col>
//             <Col {...size} style={{ textAlign: "right" }}>
//               {right}
//             </Col>
//           </Row>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// Header.defaultProps = {
//   icon: "",
//   title: "",
//   right: <div></div>,
// };

// export default Header;
import React from 'react';
import { Row, Col, Card } from 'antd';

const styles = {
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: '24px',
        height: '24px',
        marginRight: '10px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    i: {
        fontSize: '16px',
    },
};

const Header = ({ icon = '', title = '', right = <div></div> }) => {
    const size = { xs: 12, sm: 12, md: 12, lg: 12 };

    return (
        <Row gutter={12} className='mb-10'>
            <Col span={24}>
                <Card bordered={false}>
                    <Row>
                        <Col {...size}>
                            <div style={styles.row}>
                                <div style={styles.icon}>
                                    <i className="material-icons-outlined" style={styles.i}>
                                        {icon}
                                    </i>
                                </div>
                                <h1 className='h1'>{title}</h1>
                            </div>
                        </Col>
                        <Col {...size} className='textRight'>
                            {right}
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default Header;
