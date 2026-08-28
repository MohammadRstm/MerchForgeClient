import { useMutation } from "@tanstack/react-query";
import {
    uploadWebsiteCustomizationImageService,
    type WebsiteCustomizationImageKind,
} from "../../../../../services/api/businessDashboard.api";

const useUploadWebsiteCustomizationImage = (businessId: string) => {
    return useMutation({
        mutationFn: ({ file, kind }: { file: File; kind: WebsiteCustomizationImageKind }) =>
            uploadWebsiteCustomizationImageService(businessId, file, kind),
    });
};

export default useUploadWebsiteCustomizationImage;
