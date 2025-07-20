import { PrimaryButton } from "@/components/buttons/Buttons";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import AddWithdrawalBankAccount from "@/components/Modals/AddWithdrawalBankAccount";
import WithdrawalConfirmationCrypto from "@/components/Modals/WithdrawalConfirmationCrypto";
import WithdrawalConfirmationNGN from "@/components/Modals/WithdrawalConfirmationNGN";
import Toast from "@/components/Toast";
import {
  GetUserBank,
  Withdraw_Crypto,
  Withdraw_xNGN,
} from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import {
  AccountLevel,
  ACTIONS,
  bisats_limit,
} from "@/utils/transaction_limits";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Head from "../Head";

import TokenSelection from "@/components/shared/TokenSelection";
import { getUserTokenData } from "@/helpers";
import { GET_WITHDRAWAL_LIMIT } from "@/redux/actions/userActions";
import { WalletState } from "@/redux/reducers/walletSlice";
import { formatNumber } from "@/utils/numberFormat";
import KycManager from "@/pages/kyc/KYCManager";

export type TNetwork = {
  label: string;
  value: string;
};

export type TCryptoAssets = {
  address: string;
  asset: string;
  assetId: string;
  id: string;
  network: string;
};
const WithdrawalPage = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const wallet = walletState?.wallet;
  const user = userState.user;
  const location = useLocation();

  const linkedAsset = location.state?.asset;
  const [cryptoAssets, setCryptoAssets] = useState<TCryptoAssets[]>();

  const [selectedToken, setSelectedToken] = useState<string>(linkedAsset);
  const [withdrwalAmount, setWithdrwalAmount] = useState<string>();
  const [cryptoWithdrwalAddress, setCryptoWithdrwalAddress] =
    useState<string>();
  const [cryptoWithdrwalAmount, setCryptoWithdrwalAmount] = useState<string>();

  const [networks, setNetworks] = useState<TNetwork[]>([]);
  const [selectedNetwork, setSelectedNetworks] = useState<string>();
  const [bankAccountId, setbankAccountId] = useState<string>();
  const [withdrawalModal, setWithDrawalModal] = useState(false);
  const [addBankModal, setAddBankModal] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usedUpLimit, setUsedUpLimit] = useState<{
    totalUsedAmountFiat: number;
    totalUsedAmountCrypto: number;
  }>();

  const FetchMyBankList = async () => {
    let res = await GetUserBank(user?.userId);
    setBankList(
      res?.map(
        (choice: {
          bankName: string;
          id: string;
          accountName: string;
          accountNumber: string;
        }) => ({
          label: (
            <div className="text-sm flex flex-col ">
              <p>{choice?.bankName}</p>
              <p className="my-1">{choice?.accountNumber}</p>
              <p>{choice?.accountName}</p>
            </div>
          ),
          labelDisplay: (
            <div className="text-sm flex items-center gap-2">
              <p className="text-xs">{choice?.bankName}</p>
              <p> - {choice?.accountNumber}</p>
            </div>
          ),
          value: choice?.id,
        })
      )
    );
  };
  useEffect(() => {
    FetchMyBankList();
  }, [addBankModal]);

  useEffect(() => {
    const tokenList = getUserTokenData();
    for (let token of tokenList) {
      if (token.tokenName === selectedToken) {
        setNetworks(token.networks);
        return;
      }
    }
  }, [selectedToken]);

  useEffect(() => {
    if (wallet) {
      setCryptoAssets(wallet?.cryptoAssests);
    }
  }, [wallet]);

  useEffect(() => {
    const GetWithdrawalLimit = async () => {
      const summary = await GET_WITHDRAWAL_LIMIT(user?.userId);
      setUsedUpLimit({
        totalUsedAmountFiat: summary?.totalUsedAmountFiat,
        totalUsedAmountCrypto: summary?.totalUsedAmountCrypto,
      });
    };
    GetWithdrawalLimit();
  }, [user?.userId]);

  //   SUB: Calculate total Balance
  const currentBalance = useMemo(() => {
    return wallet && wallet[selectedToken];
  }, [selectedToken, wallet]);

  // HDR: Handle token selection
  const handleSelectToken = (prop: string) => {
    setSelectedToken(prop);
    if (prop === "xNGN" && (bankList.length === 0 || !bankList))
      setAddBankModal(true);
    setSelectedNetworks("");
    setbankAccountId("");
    setWithdrwalAmount("");
    setCryptoWithdrwalAddress("");
    setCryptoWithdrwalAmount("");
  };

  // HDR: Withdrawal handler
  const handleWithdrawal = async () => {
    setIsLoading(true);
    const response = await Withdraw_xNGN({
      userId: `${user?.userId}`,
      amount: Number(withdrwalAmount),
      bankAccountId: bankAccountId ?? "",
    });
    setIsLoading(false);
    if (response?.ok) {
      Toast.success(response.message, "Withdrawal Initiated");
      // navigate(APP_ROUTES.WALLET.HOME)
    } else {
      Toast.error(response.message, "");
    }
    setWithDrawalModal(false);
  };

  const getCryptoAssetId = () => {
    if (cryptoAssets) {
      for (let i of cryptoAssets) {
        console.log(selectedNetwork, i);
        if (selectedNetwork === i.network) return i.assetId;
      }
    }
  };

  // HDR: Handle crypto withdrawal
  const handleCryptoWithdrawal = async () => {
    setIsLoading(true);
    const response = await Withdraw_Crypto({
      userId: `${user?.userId}`,
      amount: Number(cryptoWithdrwalAmount),
      address: cryptoWithdrwalAddress ?? "",
      asset: getCryptoAssetId() ?? "",
    });
    setIsLoading(false);
    if (response?.ok) {
      Toast.success(response.message, "Withdrawal Initiated");
      setWithDrawalModal(false);
      // navigate(APP_ROUTES.WALLET.HOME)
    } else {
      Toast.error(response.message, "");
      setWithDrawalModal(false);
    }
  };

  const account_level = user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  return (
    <div>
      <Head
        header={"Make a Withdrawal"}
        subHeader={"Securely withdraw fiat or crypto from your account."}
      />

      <div className="mt-10">
        <TokenSelection
          title={selectedToken}
          label={"Select Asset"}
          error={undefined}
          touched={undefined}
          handleChange={(e) => handleSelectToken(e)}
        />

        {selectedToken && (
          <div className="my-4">
            {selectedToken === "xNGN" ? (
              <div>
                <MultiSelectDropDown
                  parentId={""}
                  title={"Select"}
                  choices={bankList}
                  error={undefined}
                  touched={undefined}
                  label={"Select Bank"}
                  handleChange={(e) => setbankAccountId(e)}
                />
              </div>
            ) : (
              <MultiSelectDropDown
                parentId={""}
                title={"Select option"}
                choices={networks}
                error={undefined}
                touched={undefined}
                label={"Select Network"}
                handleChange={(e) => setSelectedNetworks(e)}
              />
            )}
          </div>
        )}

        {(bankAccountId || selectedToken) &&
          (selectedToken === "xNGN" ? (
            <div>
              <PrimaryInput
                label={`Amount `}
                placeholder="Enter amount"
                type="number"
                min={userTransactionLimits?.minimum_fiat_withdrawal}
                max={userTransactionLimits?.maximum_fiat_withdrawal}
                error={
                  Number(withdrwalAmount) >
                  userTransactionLimits?.maximum_fiat_withdrawal
                    ? true
                    : false
                }
                touched={
                  Number(withdrwalAmount) >
                  userTransactionLimits?.maximum_fiat_withdrawal
                    ? true
                    : false
                }
                value={withdrwalAmount}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  const max = userTransactionLimits?.maximum_fiat_withdrawal;
                  if (max && Number(value) > max) {
                    value = max.toString();
                  }
                  setWithdrwalAmount(value);
                }}
                maxFnc={() =>
                  setWithdrwalAmount(
                    `${userTransactionLimits?.maximum_fiat_withdrawal}`
                  )
                }
              />
              <div className="border  border-[#F3F4F6] bg-[#F9F9FB] rounded-md py-4 px-5  my-5 text-sm space-y-2 ">
                <div className="flex justify-between items-center">
                  <p className="text-[#424A59] font-normal">
                    Daily remaining limit:
                  </p>
                  <p className="text-[#606C82]  font-semibold">
                    NGN{" "}
                    {userTransactionLimits?.daily_withdrawal_limit_fiat >
                    500000000
                      ? "Unlimited"
                      : formatNumber(
                          userTransactionLimits?.daily_withdrawal_limit_fiat -
                            (usedUpLimit?.totalUsedAmountFiat ?? 0)
                        )}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#424A59] font-normal">Transaction fee:</p>
                  <p className="text-[#606C82]  font-semibold">
                    {formatNumber(
                      !withdrwalAmount
                        ? "-"
                        : userTransactionLimits?.charge_on_single_withdrawal_fiat
                    )}{" "}
                    xNGN
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#424A59] font-normal">
                    Withdrawal amount:
                  </p>
                  <p className="text-[#606C82]  font-semibold">
                    {formatNumber(withdrwalAmount ?? "-")} xNGN
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#424A59] font-normal">Total:</p>
                  <p className="text-[#606C82]  font-semibold">
                    {`${formatNumber(
                      !withdrwalAmount
                        ? "-"
                        : Number(withdrwalAmount ?? 0) +
                            userTransactionLimits?.charge_on_single_withdrawal_fiat
                    )}` || "-"}{" "}
                    xNGN
                  </p>
                </div>
              </div>
              <KycManager
                action={ACTIONS.WITHDRAW_NGN}
                func={() => setWithDrawalModal(true)}
              >
                {(validateAndExecute) => (
                  <PrimaryButton
                    css="w-full"
                    text={"Withdraw"}
                    loading={false}
                    onClick={validateAndExecute}
                    disabled={!withdrwalAmount || !bankAccountId}
                  />
                )}
              </KycManager>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <PrimaryInput
                label={"Wallet Address"}
                placeholder="Enter address"
                error={undefined}
                value={cryptoWithdrwalAddress}
                onChange={(e) => setCryptoWithdrwalAddress(e.target.value)}
                touched={undefined}
              />
              <PrimaryInput
                label={`Amount`}
                type="number"
                placeholder="Enter amount"
                value={cryptoWithdrwalAmount}
                onChange={(e) => setCryptoWithdrwalAmount(e.target.value)}
                error={
                  Number(cryptoWithdrwalAmount || 0) > currentBalance
                    ? "Amount exceeds balance"
                    : undefined
                }
                touched={undefined}
              />

              <div className="border bg-[#F9F9FB] rounded-md py-3 px-5 text-sm space-y-2 my-4 ">
                <div className="flex justify-between items-center">
                  <p className="text-[#424A59] font-normal">
                    Daily remaining limit:
                  </p>
                  <p className="text-[#606C82]  font-semibold">
                    {" "}
                    {formatNumber(
                      userTransactionLimits?.daily_withdrawal_limit_crypto -
                        (usedUpLimit?.totalUsedAmountCrypto ?? 0)
                    )}{" "}
                    USD
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-[#424A59] font-normal">
                    Withdrawal amount:
                  </p>
                  <p className="text-[#606C82]  font-semibold">
                    {formatNumber(cryptoWithdrwalAmount ?? 0)} {selectedToken}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#424A59] font-normal">Total:</p>
                  <p className="text-[#606C82] font-semibold">
                    {parseFloat(cryptoWithdrwalAmount ?? "0") || "-"}{" "}
                    {selectedToken}
                  </p>
                </div>
              </div>
              <KycManager
                action={ACTIONS.WITHDRAW_CRYPTO}
                func={() => setWithDrawalModal(true)}
              >
                {(validateAndExecute) => (
                  <PrimaryButton
                    css={"w-full"}
                    text={"Withdraw"}
                    loading={false}
                    onClick={validateAndExecute}
                    disabled={
                      !cryptoWithdrwalAmount ||
                      !cryptoWithdrwalAddress ||
                      !selectedNetwork ||
                      Number(cryptoWithdrwalAmount || 0) > currentBalance
                    }
                  />
                )}
              </KycManager>
            </div>
          ))}
      </div>

      {/* HDR: WITHDRAW MODAL */}
      {withdrawalModal &&
        (selectedToken === "xNGN" ? (
          <WithdrawalConfirmationNGN
            close={() => setWithDrawalModal(false)}
            transactionFee={`${userTransactionLimits?.charge_on_single_withdrawal_fiat}`}
            withdrawalAmount={`${withdrwalAmount}`}
            total={`${
              Number(withdrwalAmount ?? 0) +
              userTransactionLimits?.charge_on_single_withdrawal_fiat
            }`}
            submit={handleWithdrawal}
            isLoading={isLoading}
          />
        ) : (
          <WithdrawalConfirmationCrypto
            close={() => setWithDrawalModal(false)}
            isLoading={isLoading}
            amount={cryptoWithdrwalAmount ?? "0"}
            address={cryptoWithdrwalAddress ?? "-"}
            submit={() => handleCryptoWithdrawal()}
            asset={selectedToken}
            network={selectedNetwork}
          />
        ))}
      {/* {verificationModal && <SecurityVerification close={() => setVerificationModal(false)} />} */}
      {addBankModal && (
        <AddWithdrawalBankAccount close={() => setAddBankModal(false)} />
      )}
    </div>
  );
};

export default WithdrawalPage;
