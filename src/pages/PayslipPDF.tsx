import { Document, Image, Page, Text, View, Font } from "@react-pdf/renderer";
import React from "react";
Font.register({
  family: "poppins",
  src: "/fonts/poppins.regular.ttf",
});
type Props = {
  full_name: string;
  hours: number;
  student_number: string;
  phone_number: string;
  email: string;
};
const PayslipPDF = ({
  email,
  full_name,
  hours,
  phone_number,
  student_number,
}: Props) => {
  const RATE = 20.835;
  const UIF = 50;
  const HOURS = hours;
  const netpay = HOURS * RATE - UIF;
  return (
    <Document>
      <Page size={"A4"} orientation="landscape" style={{ padding: 15 }}>
        <View
          style={{
            display: "flex",
            marginTop: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Image
              source={"/icep_logo.jpeg"}
              style={{ width: 55, height: 55 }}
            />
            <Text style={{ fontWeight: 9600, fontSize: 35, color: "#1231A0" }}>
              ICEP
            </Text>
          </View>
          <View style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <Text style={{ fontWeight: 9600, fontSize: 35, color: "#1231A0" }}>
              PAYSLIP
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text
            style={{ fontFamily: "poppins", color: "#6079D2", fontSize: 11 }}
          >
            02 Aubrey Matlala Road, Block K,
          </Text>
          <Text
            style={{ fontFamily: "poppins", color: "#6079D2", fontSize: 11 }}
          >
            admin@icep.co.za
          </Text>
          <Text
            style={{ fontFamily: "poppins", color: "#6079D2", fontSize: 11 }}
          >
            012 382 9598
          </Text>
        </View>
        <View
          style={{
            marginTop: 15,
            display: "flex",
            flexDirection: "row",

            justifyContent: "space-between",
          }}
        >
          <View>
            <View
              style={{
                backgroundColor: "#748AD6",
                width: 230,
                padding: 5,
                marginBottom: 5,
              }}
            >
              <Text
                style={{ fontFamily: "poppins", color: "white", fontSize: 12 }}
              >
                Employeee Infomartion
              </Text>
            </View>
            <Text style={{ fontSize: 17, fontWeight: 600, marginBottom: 2 }}>
              {full_name}
            </Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 12, marginBottom: 1 }}
            >
              ID: {student_number}
            </Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 12, marginBottom: 1 }}
            >
              Phone: {phone_number}
            </Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 12, marginBottom: 1 }}
            >
              Email: {email}
            </Text>
          </View>
          <View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <View>
                <View
                  style={{ backgroundColor: "#748AD6", width: 100, padding: 3 }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "poppins",
                      fontSize: 14,
                    }}
                  >
                    PAYDAY
                  </Text>
                </View>
                <View
                  style={{ padding: 3, width: 100, backgroundColor: "#CACFE2" }}
                >
                  <Text
                    style={{
                      fontFamily: "poppins",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 1,
                      0
                    ).getDate()}
                    /{new Date().getMonth() + 1}/{new Date().getFullYear()}
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={{ backgroundColor: "#748AD6", width: 100, padding: 3 }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "poppins",
                      fontSize: 14,
                    }}
                  >
                    PAYTYPE
                  </Text>
                </View>
                <View
                  style={{ padding: 3, width: 100, backgroundColor: "#CACFE2" }}
                >
                  <Text
                    style={{
                      fontFamily: "poppins",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Monthly
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 4, alignSelf: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "poppins",
                  textAlign: "right",
                  fontSize: 10,
                }}
              >
                Payment Method: Bank Transfer
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 5 }}>
          <View
            style={{
              marginTop: 9,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "#D9DCE7",
            }}
          >
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 8 }}>
              Earnings
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              Hours
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              Rate
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              Current
            </Text>
          </View>
          <View
            style={{
              marginTop: 2,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#D9DCE7",
            }}
          >
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 8 }}>
              Standard Pay
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              {HOURS}
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              R {Number(RATE).toFixed(2)}
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              R{Number(HOURS * RATE).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              padding: 5,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "#D9DCE7",
            }}
          >
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 8 }}
            ></Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}
            ></Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              Gross Pay
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              R{Number(HOURS * RATE).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 5 }}>
          <View
            style={{
              marginTop: 25,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "#D9DCE7",
            }}
          >
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 8 }}>
              Deductions
            </Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}
            ></Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}
            ></Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              Current
            </Text>
          </View>
          <View
            style={{
              marginTop: 2,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#D9DCE7",
            }}
          >
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 8 }}>
              UIF
            </Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}
            ></Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}
            ></Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              R{UIF}
            </Text>
          </View>
          <View
            style={{
              padding: 5,
              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 8 }}
            ></Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}
            ></Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              Total
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
              R50
            </Text>
          </View>
          <View
            style={{
              marginTop: 1,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 8 }}
            ></Text>
            <Text
              style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}
            ></Text>
            <View
              style={{
                padding: 3,
                backgroundColor: "#D9DCE7",
                alignItems: "center",
                justifyContent: "center",
                flex: 4,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
                Net Pay
              </Text>
              <Text style={{ fontFamily: "poppins", fontSize: 16, flex: 2 }}>
                R{Number(netpay).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPDF;
